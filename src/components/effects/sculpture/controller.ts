import { createAnimatable } from 'animejs/animatable'
import { createTimeline, type Timeline } from 'animejs/timeline'
import { stagger } from 'animejs/utils'
import { interaction } from '@/design-system/interaction'
import { modeWeights, STRAND_COUNT } from './geometry'
import { createSculptureRenderer, type SculptureScene } from './renderer'

export function createSculptureController(
  canvas: HTMLCanvasElement,
  stage: HTMLElement,
  mode: number,
) {
  let renderer = createSculptureRenderer(canvas)
  if (!renderer) return null

  const settings = interaction.sculpture
  const scene: SculptureScene = {
    pointerX: 0,
    pointerY: 0,
    presence: 0,
    scroll: 0,
    entrance: 0,
    energy: 0,
    phase: 0,
  }
  const strands = Array.from({ length: STRAND_COUNT }, () => modeWeights(mode))
  let frame = 0
  let visible = true
  let disposed = false
  let contextLost = false
  let transition: Timeline | undefined

  function render() {
    frame = 0
    if (disposed || contextLost || !visible || document.hidden || !renderer) return
    renderer!.render(scene, strands)
    stage.dataset.ready = 'true'
  }

  function requestRender() {
    if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(render)
  }

  const movement = createAnimatable(scene, {
    pointerX: settings.pointerDuration,
    pointerY: settings.pointerDuration,
    presence: settings.pointerDuration,
    scroll: settings.scrollDuration,
    ease: 'out(3)',
    onUpdate: requestRender,
  })

  function transitionTo(nextMode: number, entrance = false) {
    transition?.cancel()
    scene.phase = 0
    transition = createTimeline({ onUpdate: requestRender })
      .add(
        strands,
        {
          ...modeWeights(nextMode),
          duration: settings.morphDuration,
          delay: stagger(settings.strandDelay, { from: 'center' }),
          ease: 'inOut(3)',
        },
        0,
      )
      .add(scene, { energy: 1, duration: 320, ease: 'out(3)' }, 0)
      .add(scene, { energy: 0, duration: 1000, ease: 'inOut(3)' }, 320)
      .add(scene, { phase: 1, duration: 1320, ease: 'linear' }, 0)
    if (entrance) {
      transition.add(scene, { entrance: 1, duration: 1500, ease: 'out(4)' }, 0)
    } else {
      scene.entrance = 1
    }
    if (!visible || document.hidden) transition.pause()
  }

  function move(event: PointerEvent) {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    const bounds = stage.getBoundingClientRect()
    movement.pointerX(((event.clientX - bounds.left) / bounds.width - 0.5) * 2)
    movement.pointerY(((event.clientY - bounds.top) / bounds.height - 0.5) * 2)
    movement.presence(1)
  }

  function leave() {
    movement.pointerX(0)
    movement.pointerY(0)
    movement.presence(0)
  }

  function scroll() {
    if (!visible || document.hidden || contextLost) return
    const bounds = stage.getBoundingClientRect()
    movement.scroll(Math.max(0, Math.min(1, -bounds.top / bounds.height)))
  }

  function resize() {
    const bounds = stage.getBoundingClientRect()
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    renderer!.resize(bounds.width, bounds.height, ratio)
    requestRender()
  }

  function updateVisibility() {
    if (visible && !document.hidden && !contextLost) {
      if (transition && !transition.completed) transition.resume()
      scroll()
      requestRender()
    } else {
      transition?.pause()
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }
  }

  function loseContext(event: Event) {
    event.preventDefault()
    contextLost = true
    delete stage.dataset.ready
    stage.dataset.fallback = 'true'
    updateVisibility()
  }

  function restoreContext() {
    renderer?.dispose()
    renderer = createSculptureRenderer(canvas)
    contextLost = !renderer
    if (!renderer) return
    delete stage.dataset.fallback
    resize()
    updateVisibility()
  }

  const resizeObserver = new ResizeObserver(resize)
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    updateVisibility()
  })
  resizeObserver.observe(stage)
  intersectionObserver.observe(stage)
  stage.addEventListener('pointermove', move)
  stage.addEventListener('pointerleave', leave)
  window.addEventListener('scroll', scroll, { passive: true })
  document.addEventListener('visibilitychange', updateVisibility)
  canvas.addEventListener('webglcontextlost', loseContext)
  canvas.addEventListener('webglcontextrestored', restoreContext)
  resize()
  transitionTo(mode, true)

  return {
    setMode: transitionTo,
    dispose() {
      disposed = true
      transition?.cancel()
      movement.revert()
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerleave', leave)
      window.removeEventListener('scroll', scroll)
      document.removeEventListener('visibilitychange', updateVisibility)
      canvas.removeEventListener('webglcontextlost', loseContext)
      canvas.removeEventListener('webglcontextrestored', restoreContext)
      renderer?.dispose()
      delete stage.dataset.ready
      delete stage.dataset.fallback
    },
  }
}

export type SculptureController = NonNullable<ReturnType<typeof createSculptureController>>
