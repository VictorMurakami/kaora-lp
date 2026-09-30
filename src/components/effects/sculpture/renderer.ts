import {
  ACESFilmicToneMapping,
  DirectionalLight,
  Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  Quaternion,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { createOrbitalAssembly, drawStroke } from './orbital-assembly'
import {
  FLOW_LANES,
  FLOW_PER_LANE,
  ORBIT_CORE_SCALE,
  ORBIT_COUNT,
  RING_ARC,
  blendPose,
  flowDrift,
  flowPoint,
  planetPoint,
  spiralCrossing,
  ringCenter,
  ringPoint,
  satellitePosition,
  VIEW_SIZE,
  type Point3D,
  type Strand,
} from './geometry'

const BASE_FOV = 38
const FIT_ASPECT = VIEW_SIZE.width / VIEW_SIZE.height

export type SculptureScene = {
  pointerX: number
  pointerY: number
  presence: number
  scroll: number
  entrance: number
  energy: number
  phase: number
}

export function createSculptureRenderer(canvas: HTMLCanvasElement) {
  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    })
  } catch {
    return null
  }
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new Scene()
  const camera = new PerspectiveCamera(BASE_FOV, 1, 0.1, 50)
  camera.position.z = 5.6
  const room = new RoomEnvironment()
  const generator = new PMREMGenerator(renderer)
  const environment = generator.fromScene(room, 0.04)
  scene.environment = environment.texture
  scene.environmentIntensity = 1.1
  room.dispose()
  generator.dispose()

  const key = new DirectionalLight('#fff1dd', 3)
  key.position.set(-3, 4, 5)
  scene.add(key)
  const rim = new DirectionalLight('#fc652d', 5)
  rim.position.set(3, -1, -2)
  scene.add(rim)
  const assembly = createOrbitalAssembly()
  scene.add(assembly.root)
  const dummy = new Object3D()
  const facing = new Quaternion()
  const head: Point3D = { x: 0, y: 0, z: 0 }
  const tail: Point3D = { x: 0, y: 0, z: 0 }

  return {
    render(state: SculptureScene, strands: Strand[]) {
      const weights = strands[Math.floor(strands.length / 2)]
      const pose = blendPose(weights)
      assembly.root.rotation.set(
        pose.pitch + state.pointerY * 0.35 + state.scroll * 0.35,
        pose.yaw + state.pointerX * 0.5 + state.scroll * 0.9 + (1 - state.entrance) * 0.5,
        pose.roll + state.pointerX * 0.08,
      )
      assembly.root.scale.setScalar(
        pose.scale * (0.9 + state.entrance * 0.1) * (1 - state.scroll * 0.13),
      )

      // Form: the ring erases from its far end as it turns into the stream.
      const drawn = clamp(1 - weights.flow * 1.25)
      drawStroke(assembly.ring, drawn)
      assembly.startCap.visible = drawn > 0
      assembly.endCap.visible = drawn > 0
      const end = ringCenter(drawn)
      assembly.endCap.position.set(end.x, end.y, end.z)
      assembly.ringGroup.scale.setScalar(
        (1 + (ORBIT_CORE_SCALE - 1) * weights.orbit) * (1 + state.energy * 0.03),
      )
      // In orbit the core turns to face the viewer so the symbol stays legible.
      facing.copy(assembly.root.quaternion).invert()
      assembly.ringGroup.quaternion.identity().slerp(facing, smooth(weights.orbit))

      // Flow: each ring segment is released into a lane as the stroke reaches it.
      const drift =
        flowDrift(weights) +
        weights.flow * (state.presence * state.pointerX * 0.5 + state.scroll * 1.2)
      assembly.particles.visible = weights.flow > 0.001
      if (assembly.particles.visible) {
        for (let lane = 0; lane < FLOW_LANES; lane++) {
          const tube = lane / FLOW_LANES
          for (let step = 0; step < FLOW_PER_LANE; step++) {
            const t = 0.05 + ((step + ((lane * 0.37) % 1)) / FLOW_PER_LANE) * 0.9
            const along = clamp((t * Math.PI * 2 - (Math.PI * 2 - RING_ARC) / 2) / RING_ARC)
            const release = smooth(clamp((weights.flow * 1.25 - (1 - along)) / 0.25))
            particleAt(along, tube, t, lane, drift, release, head)
            particleAt(along, tube, t + 0.004, lane, drift, release, tail)
            dummy.position.set(head.x, head.y, head.z)
            dummy.lookAt(tail.x, tail.y, tail.z)
            const size = Math.min(1, release * 3)
            const length = step % 3 === 0 ? 0.06 : 0.032
            dummy.scale.set(0.024 * size, 0.024 * size, length * size)
            dummy.updateMatrix()
            assembly.particles.setMatrixAt(lane * FLOW_PER_LANE + step, dummy.matrix)
          }
        }
        assembly.particles.instanceMatrix.needsUpdate = true
      }

      // Orbit: the satellite rides the spiral out of the core; each stage draws
      // from the point where the path crosses it, and its planet glides in.
      const path = weights.orbit
      assembly.orbitGroup.visible = path > 0.001
      drawStroke(assembly.trail, path)
      const planetDrift =
        (path - 1) * 1.4 + path * (state.presence * state.pointerX * 0.6 + state.scroll * 1.1)
      assembly.orbits.forEach(({ stroke, planet, crossing }, index) => {
        const start = spiralCrossing(index) * 0.75
        const progress = smooth(clamp((path - start) / (1 - start)))
        drawStroke(stroke, progress)
        const position = planetPoint(index, planetDrift)
        planet.position.set(position.x, position.y, position.z)
        planet.scale.setScalar(smooth(clamp(progress * 2)))
        planet.visible = progress > 0.001
        const reached =
          index < ORBIT_COUNT - 1 ? smooth(clamp((path - spiralCrossing(index)) / 0.06)) : 0
        crossing.scale.setScalar(reached)
        crossing.visible = reached > 0.001
      })
      const outerStart = spiralCrossing(ORBIT_COUNT - 1) * 0.75
      assembly.ticks.count = Math.round(
        smooth(clamp((path - outerStart) / (1 - outerStart))) * assembly.tickCount,
      )

      const satellite = satellitePosition(weights, drift)
      assembly.satellite.position.set(satellite.x, satellite.y, satellite.z)
      assembly.satellite.scale.setScalar(1 + state.energy * 0.06)
      assembly.halo.position.copy(assembly.satellite.position)
      assembly.halo.quaternion.copy(facing)
      assembly.halo.scale.setScalar(smooth(clamp((path - 0.8) / 0.2)) * (1 + state.energy * 0.1))
      renderer.render(scene, camera)
    },
    resize(width: number, height: number, ratio: number) {
      renderer.setPixelRatio(ratio)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      // Narrower than the static drawing's frame, keep the width in view too, so
      // the widest state never clips at the sides; wider stages keep the height.
      camera.fov =
        camera.aspect >= FIT_ASPECT
          ? BASE_FOV
          : (2 *
              Math.atan(Math.tan((BASE_FOV * Math.PI) / 360) * (FIT_ASPECT / camera.aspect)) *
              180) /
            Math.PI
      camera.updateProjectionMatrix()
    },
    dispose() {
      assembly.dispose()
      environment.dispose()
      renderer.dispose()
    },
  }
}

function clamp(value: number) {
  return Math.max(0, Math.min(1, value))
}

function smooth(value: number) {
  return value * value * (3 - 2 * value)
}

function particleAt(
  along: number,
  tube: number,
  t: number,
  lane: number,
  drift: number,
  release: number,
  target: Point3D,
) {
  const home = ringPoint(along, tube)
  const away = flowPoint(t, lane, drift)
  target.x = home.x + (away.x - home.x) * release
  target.y = home.y + (away.y - home.y) * release
  target.z = home.z + (away.z - home.z) * release
}
