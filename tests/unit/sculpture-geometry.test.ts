import { describe, expect, it } from 'vitest'
import {
  BRAND_GAP,
  FLOW_LANES,
  GAP_CENTER,
  MODE_POSES,
  ORBIT_CORE_SCALE,
  ORBIT_COUNT,
  ORBIT_GAP,
  ORBIT_RADII,
  RING_RADIUS,
  RING_TUBE,
  SPIRAL_START,
  blendPose,
  createFallbackArtwork,
  flowPoint,
  modeWeights,
  orbitPoint,
  ringCenter,
  satellitePosition,
  spiralCrossing,
  spiralPoint,
  type Point3D,
} from '@/components/effects/sculpture/geometry'

function angleOf(point: Point3D) {
  return Math.atan2(point.y, point.x)
}

function distance(a: Point3D, b: Point3D) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)
}

describe('form: the brand symbol', () => {
  it('keeps the visible opening of the symbol between the rounded caps', () => {
    const start = angleOf(ringCenter(0))
    const end = angleOf(ringCenter(1))
    const swept = (start - end + Math.PI * 2) % (Math.PI * 2)
    const capAngle = RING_TUBE / RING_RADIUS
    expect(swept - 2 * capAngle).toBeCloseTo(BRAND_GAP, 10)
  })

  it('rests the satellite on the ring line, centred in the opening', () => {
    const satellite = satellitePosition(modeWeights(0), 0)
    expect(Math.hypot(satellite.x, satellite.y)).toBeCloseTo(RING_RADIUS, 10)
    expect(angleOf(satellite)).toBeCloseTo(GAP_CENTER, 10)
    expect(satellite.z).toBe(0)
  })
})

describe('flow: the ring unravelled into lanes', () => {
  it('closes every lane into a continuous loop', () => {
    for (let lane = 0; lane < FLOW_LANES; lane++) {
      expect(distance(flowPoint(0, lane, 0.4), flowPoint(1, lane, 0.4))).toBeCloseTo(0, 10)
    }
  })

  it('spreads the lanes apart instead of stacking them on the ring', () => {
    const inner = flowPoint(0.3, 0, 0)
    const outer = flowPoint(0.3, FLOW_LANES - 1, 0)
    expect(distance(inner, outer)).toBeGreaterThan(RING_TUBE * 2)
  })

  it('moves the satellite along the stream as it drifts', () => {
    const still = satellitePosition(modeWeights(1), 0)
    const moved = satellitePosition(modeWeights(1), 0.9)
    expect(distance(still, moved)).toBeGreaterThan(0.5)
  })
})

describe('orbit: the client passes through every stage', () => {
  it('nests the four stages as concentric orbits around the core', () => {
    for (let index = 1; index < ORBIT_COUNT; index++) {
      expect(ORBIT_RADII[index]).toBeGreaterThan(ORBIT_RADII[index - 1])
    }
    expect(ORBIT_CORE_SCALE * RING_RADIUS).toBeLessThan(SPIRAL_START)
  })

  it('rests the satellite on the last orbit, where it sat in form', () => {
    const satellite = satellitePosition(modeWeights(2), 0)
    expect(Math.hypot(satellite.x, satellite.y)).toBeCloseTo(ORBIT_RADII[ORBIT_COUNT - 1], 10)
    expect(angleOf(satellite)).toBeCloseTo(GAP_CENTER, 10)
  })

  it('crosses every orbit on the drawn arc, never in its gap', () => {
    for (let index = 0; index < ORBIT_COUNT; index++) {
      const crossing = spiralPoint(spiralCrossing(index))
      expect(distance(crossing, orbitPoint(index, 0))).toBeCloseTo(0, 10)
    }
  })

  it('leaves each orbit open on the side opposite its crossing', () => {
    for (let index = 0; index < ORBIT_COUNT; index++) {
      const [first, last] = [orbitPoint(index, -1), orbitPoint(index, 1)]
      const radius = ORBIT_RADII[index]
      const opening = Math.acos((first.x * last.x + first.y * last.y) / (radius * radius))
      expect(opening).toBeCloseTo(ORBIT_GAP, 10)
      const crossing = orbitPoint(index, 0)
      const middle = { x: (first.x + last.x) / 2, y: (first.y + last.y) / 2 }
      const facing =
        (middle.x * crossing.x + middle.y * crossing.y) / (Math.hypot(middle.x, middle.y) * radius)
      expect(facing).toBeCloseTo(-1, 10)
    }
  })

  it('keeps the satellite on its own trail while entering orbit', () => {
    for (const orbit of [0.4, 0.6, 0.8]) {
      const satellite = satellitePosition({ form: 1 - orbit, flow: 0, orbit }, 0)
      expect(distance(satellite, spiralPoint(orbit))).toBeCloseTo(0, 10)
    }
  })
})

describe('mode transitions', () => {
  it('lands exactly on each mode pose', () => {
    for (const mode of [0, 1, 2]) expect(blendPose(modeWeights(mode))).toEqual(MODE_POSES[mode])
  })

  it('draws a visibly different static artwork for each mode', () => {
    const [form, flow, orbit] = [0, 1, 2].map(createFallbackArtwork)
    expect(new Set([form.paths.length, flow.paths.length, orbit.paths.length]).size).toBe(3)
    const satellites = [form, flow, orbit].map(({ satellite }) => satellite)
    for (let a = 0; a < 3; a++) {
      for (let b = a + 1; b < 3; b++) {
        const gap = Math.hypot(satellites[a].x - satellites[b].x, satellites[a].y - satellites[b].y)
        expect(gap).toBeGreaterThan(20)
      }
    }
  })
})
