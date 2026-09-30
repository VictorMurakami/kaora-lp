'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import type { Dictionary } from '@/content'
import { createFallbackArtwork } from './sculpture/geometry'
import type { SculptureController } from './sculpture/controller'

const compositions = [0, 1, 2].map(createFallbackArtwork)
const destinations = ['services', 'playground', 'process']

type GenerativeSculptureProps = {
  copy: Dictionary['studio']
  /** `lab` gives the artwork the full width and a taller stage. */
  variant?: 'hero' | 'lab'
  /** Prefix for the destination links when rendered outside the landing. */
  linkBase?: string
  onModeChange?: (mode: number) => void
}

export function GenerativeSculpture({
  copy,
  variant = 'hero',
  linkBase = '',
  onModeChange,
}: GenerativeSculptureProps) {
  const [mode, setMode] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controllerRef = useRef<SculptureController | null>(null)
  const modeRef = useRef(mode)
  const reducedMotion = useReducedMotion()
  const gradientId = useId()
  const artwork = compositions[mode]

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas || reducedMotion) return
    let disposed = false
    import('./sculpture/controller')
      .then(({ createSculptureController }) => {
        if (disposed) return
        controllerRef.current = createSculptureController(canvas, stage, modeRef.current)
        if (!controllerRef.current) stage.dataset.fallback = 'true'
      })
      .catch(() => {
        if (!disposed) stage.dataset.fallback = 'true'
      })
    return () => {
      disposed = true
      controllerRef.current?.dispose()
      controllerRef.current = null
      delete stage.dataset.fallback
    }
  }, [reducedMotion])

  function selectMode(nextMode: number) {
    setMode(nextMode)
    modeRef.current = nextMode
    controllerRef.current?.setMode(nextMode)
    onModeChange?.(nextMode)
  }

  return (
    <div className={variant === 'lab' ? 'experiment experiment-lab' : 'experiment'}>
      <div className="experiment-heading">
        <span>
          <span className="status-dot" /> {copy.experimentLabel}
        </span>
        <span>
          {String(mode + 1).padStart(2, '0')} /{' '}
          {String(copy.experimentModes.length).padStart(2, '0')}
        </span>
      </div>
      <div ref={stageRef} className="sculpture-stage" aria-hidden="true">
        <div className="sculpture-grid" />
        <Plus className="registration registration-top" size={13} />
        <Plus className="registration registration-bottom" size={13} />
        <svg viewBox="0 0 560 530" className="sculpture sculpture-fallback" fill="none">
          <defs>
            <linearGradient id={`${gradientId}-ring`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--color-neutral-50)" />
              <stop offset="0.55" stopColor="var(--color-neutral-300)" />
              <stop offset="1" stopColor="var(--color-neutral-500)" />
            </linearGradient>
            <radialGradient id={`${gradientId}-satellite`} cx="0.35" cy="0.3" r="0.75">
              <stop offset="0" stopColor="var(--color-brand-200)" />
              <stop offset="0.45" stopColor="var(--color-brand-400)" />
              <stop offset="1" stopColor="var(--color-brand-700)" />
            </radialGradient>
          </defs>
          <g stroke={`url(#${gradientId}-ring)`} strokeWidth="0.8" className="sculpture-lines">
            {artwork.paths.map((path, index) => (
              <path key={`${mode}-${index}`} d={path} />
            ))}
          </g>
          <g fill={`url(#${gradientId}-ring)`}>
            {artwork.dots.map((dot, index) => (
              <circle key={`${mode}-dot-${index}`} cx={dot.x} cy={dot.y} r={dot.r} />
            ))}
          </g>
          <circle
            cx={artwork.satellite.x}
            cy={artwork.satellite.y}
            r={artwork.satellite.r}
            fill={`url(#${gradientId}-satellite)`}
          />
        </svg>
        <canvas ref={canvasRef} className="sculpture-canvas" />
        <span className="sculpture-coordinate">K / {String(mode + 1).padStart(2, '0')}</span>
      </div>
      <div className="experiment-bottom">
        <div>
          <a className="experiment-destination" href={`${linkBase}#${destinations[mode]}`}>
            {copy.experimentDestinations[mode]} <ArrowUpRight size={14} aria-hidden />
          </a>
          <span>{copy.experimentCaptions[mode]}</span>
        </div>
        <div className="experiment-controls" role="group" aria-label={copy.experimentAria}>
          {copy.experimentModes.map((label, index) => (
            <button
              key={label}
              type="button"
              aria-pressed={mode === index}
              onClick={() => selectMode(index)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
