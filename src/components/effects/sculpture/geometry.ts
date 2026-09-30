export const STRAND_COUNT = 40
export const VIEW_SIZE = { width: 560, height: 530 }

export type Point3D = { x: number; y: number; z: number }
export type Pose = { pitch: number; yaw: number; roll: number; scale: number }
export type Strand = { form: number; flow: number; orbit: number }

const TAU = Math.PI * 2

// Unit proportions measured from the brand symbol (146px viewBox): the ring's
// centre line sits at r=62.5 with a 21px band, and the satellite (r=16) rests
// on that centre line inside the opening at the upper right.
export const RING_RADIUS = 1
export const RING_TUBE = 0.168
export const SATELLITE_RADIUS = 0.256
export const GAP_CENTER = Math.PI / 4
export const BRAND_GAP = 0.87
// The rounded caps close part of the opening, so the swept arc is shorter
// than the visible gap by one tube diameter.
export const RING_ARC = TAU - BRAND_GAP - (2 * RING_TUBE) / RING_RADIUS
export const RING_START = GAP_CENTER + (TAU - RING_ARC) / 2

export const FLOW_LANES = 7
export const FLOW_PER_LANE = 72
export const FLOW_WIDTH = 0.62

export const ORBIT_COUNT = 4
export const ORBIT_RADII = [0.72, 0.97, 1.22, 1.47]
export const ORBIT_TUBES = [0.009, 0.0105, 0.012, 0.014]
// Each orbit is open like the brand ring, with its gap opposite the point
// where the client's path crosses it.
export const ORBIT_GAP = 0.55
export const ORBIT_ARC = TAU - ORBIT_GAP
export const ORBIT_CORE_SCALE = 0.36
export const SPIRAL_START = 0.44
const SPIRAL_SWEEP = 1.25 * TAU
const PLANET_OFFSETS = [2.3, -2.1, 2.7, -2.5]
export const PLANET_RADII = [0.05, 0.066, 0.046, 0.074]

export const MODE_POSES: Pose[] = [
  { pitch: -0.1, yaw: -0.18, roll: 0, scale: 1.12 },
  { pitch: -0.62, yaw: -0.3, roll: 0.12, scale: 1.08 },
  { pitch: -1.02, yaw: -0.12, roll: 0.18, scale: 1.12 },
]

export function modeWeights(mode: number): Strand {
  return { form: mode === 0 ? 1 : 0, flow: mode === 1 ? 1 : 0, orbit: mode === 2 ? 1 : 0 }
}

export function blendPose(weights: Strand): Pose {
  const [form, flow, orbit] = MODE_POSES
  const mix = (key: keyof Pose) =>
    form[key] * weights.form + flow[key] * weights.flow + orbit[key] * weights.orbit
  return { pitch: mix('pitch'), yaw: mix('yaw'), roll: mix('roll'), scale: mix('scale') }
}

export function ringAngle(t: number) {
  return RING_START + t * RING_ARC
}

/** The ring's centre line, where the rounded caps sit. */
export function ringCenter(t: number): Point3D {
  const angle = ringAngle(t)
  return { x: Math.cos(angle) * RING_RADIUS, y: Math.sin(angle) * RING_RADIUS, z: 0 }
}

/** A point on the ring surface; `tube` walks around the band's cross-section. */
export function ringPoint(t: number, tube = 0, scale = 1): Point3D {
  const angle = ringAngle(t)
  const radius = RING_RADIUS + Math.cos(tube * TAU) * RING_TUBE
  return {
    x: Math.cos(angle) * radius * scale,
    y: Math.sin(angle) * radius * scale,
    z: Math.sin(tube * TAU) * RING_TUBE * scale,
  }
}

/**
 * The ring unravelled into a twisted ribbon of parallel lanes. `t` runs once
 * around the circle from the satellite, and `drift` slides every lane along it.
 */
export function flowPoint(t: number, lane: number, drift: number): Point3D {
  const angle = GAP_CENTER + t * TAU + drift
  const offset = (lane / (FLOW_LANES - 1) - 0.5) * FLOW_WIDTH
  const twist = angle + Math.PI / 2
  const radius = RING_RADIUS + Math.cos(twist) * offset + Math.sin(angle * 3) * 0.05
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    z: Math.sin(twist) * offset + Math.sin(angle * 2) * 0.28,
  }
}

/**
 * The client's path in orbit mode: it leaves the core and spirals out through
 * every stage, ending on the last orbit where the satellite rests in form.
 */
export function spiralPoint(progress: number): Point3D {
  const radius = SPIRAL_START + (ORBIT_RADII[ORBIT_COUNT - 1] - SPIRAL_START) * progress
  const angle = GAP_CENTER - SPIRAL_SWEEP * (1 - progress)
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: 0 }
}

/** Spiral progress at which the client's path reaches a stage. */
export function spiralCrossing(index: number) {
  return (ORBIT_RADII[index] - SPIRAL_START) / (ORBIT_RADII[ORBIT_COUNT - 1] - SPIRAL_START)
}

export function crossingAngle(index: number) {
  return GAP_CENTER - SPIRAL_SWEEP * (1 - spiralCrossing(index))
}

/** `u` walks an open orbit from one cap (-1) through the crossing (0) to the other (1). */
export function orbitPoint(index: number, u: number): Point3D {
  const angle = crossingAngle(index) + (u * ORBIT_ARC) / 2
  return {
    x: Math.cos(angle) * ORBIT_RADII[index],
    y: Math.sin(angle) * ORBIT_RADII[index],
    z: 0,
  }
}

/** Inner stages travel faster, as in a real orbit. */
export function planetPoint(index: number, drift: number): Point3D {
  const speed = Math.pow(ORBIT_RADII[0] / ORBIT_RADII[index], 1.5)
  const angle = crossingAngle(index) + PLANET_OFFSETS[index] + drift * speed
  return {
    x: Math.cos(angle) * ORBIT_RADII[index],
    y: Math.sin(angle) * ORBIT_RADII[index],
    z: 0,
  }
}

export function flowDrift(weights: Strand) {
  return weights.flow * 0.9
}

function smoothstep(value: number) {
  const clamped = Math.max(0, Math.min(1, value))
  return clamped * clamped * (3 - 2 * clamped)
}

export function satellitePosition(weights: Strand, drift: number): Point3D {
  const form = {
    x: Math.cos(GAP_CENTER) * RING_RADIUS,
    y: Math.sin(GAP_CENTER) * RING_RADIUS,
    z: 0,
  }
  const flow = flowPoint(0, (FLOW_LANES - 1) / 2, drift)
  const others = weights.form + weights.flow
  const base =
    others > 0
      ? {
          x: (form.x * weights.form + flow.x * weights.flow) / others,
          y: (form.y * weights.form + flow.y * weights.flow) / others,
          z: (flow.z * weights.flow) / others,
        }
      : form
  // Entering orbit, the satellite drops into the core first and then rides
  // the spiral out, so it is always on the path it leaves behind.
  const pull = weights.orbit >= 1 ? 1 : smoothstep(weights.orbit * 3)
  const orbit = spiralPoint(weights.orbit)
  return {
    x: base.x + (orbit.x - base.x) * pull,
    y: base.y + (orbit.y - base.y) * pull,
    z: base.z + (orbit.z - base.z) * pull,
  }
}

const FALLBACK_SCALE = 140
const PERSPECTIVE = 760

/** Projects unit-space geometry (y up) into the 560x530 SVG view (y down). */
export function projectPoint(point: Point3D, pose: Pose): Point3D {
  const px = point.x * FALLBACK_SCALE
  const py = point.y * FALLBACK_SCALE
  const pz = point.z * FALLBACK_SCALE
  const y = py * Math.cos(pose.pitch) - pz * Math.sin(pose.pitch)
  const depth = py * Math.sin(pose.pitch) + pz * Math.cos(pose.pitch)
  const x = px * Math.cos(pose.yaw) + depth * Math.sin(pose.yaw)
  const z = -px * Math.sin(pose.yaw) + depth * Math.cos(pose.yaw)
  const rx = x * Math.cos(pose.roll) - y * Math.sin(pose.roll)
  const ry = x * Math.sin(pose.roll) + y * Math.cos(pose.roll)
  const perspective = (PERSPECTIVE / (PERSPECTIVE - z)) * pose.scale
  return {
    x: VIEW_SIZE.width / 2 + rx * perspective,
    y: VIEW_SIZE.height / 2 - ry * perspective,
    z,
  }
}

function polyline(points: Point3D[], pose: Pose) {
  return points
    .map((point, index) => {
      const projected = projectPoint(point, pose)
      return `${index === 0 ? 'M' : 'L'}${projected.x.toFixed(2)},${projected.y.toFixed(2)}`
    })
    .join(' ')
}

const FALLBACK_SAMPLES = 144

function ringStrands(scale: number, pose: Pose, count: number) {
  return Array.from({ length: count }, (_, strand) =>
    polyline(
      Array.from({ length: FALLBACK_SAMPLES + 1 }, (_, index) =>
        ringPoint(index / FALLBACK_SAMPLES, strand / count, scale),
      ),
      pose,
    ),
  )
}

export type Dot = { x: number; y: number; r: number }

export type FallbackArtwork = {
  paths: string[]
  dots: Dot[]
  satellite: Dot
}

function projectDot(point: Point3D, radius: number, pose: Pose): Dot {
  const center = projectPoint(point, pose)
  const depth = PERSPECTIVE / (PERSPECTIVE - center.z)
  return { x: center.x, y: center.y, r: radius * FALLBACK_SCALE * pose.scale * depth }
}

/** Static artwork for reduced motion, forced colours and missing WebGL. */
export function createFallbackArtwork(mode: number): FallbackArtwork {
  const weights = modeWeights(mode)
  const pose = MODE_POSES[mode]
  let paths: string[]
  let dots: Dot[] = []
  if (mode === 1) {
    const drift = flowDrift(weights)
    paths = Array.from({ length: FLOW_LANES }, (_, lane) =>
      polyline(
        Array.from({ length: FALLBACK_SAMPLES + 1 }, (_, index) =>
          flowPoint(0.05 + (index / FALLBACK_SAMPLES) * 0.9, lane, drift),
        ),
        pose,
      ),
    )
  } else if (mode === 2) {
    const orbits = Array.from({ length: ORBIT_COUNT }, (_, orbit) =>
      polyline(
        Array.from({ length: FALLBACK_SAMPLES + 1 }, (_, index) =>
          orbitPoint(orbit, (index / FALLBACK_SAMPLES) * 2 - 1),
        ),
        pose,
      ),
    )
    const spiral = polyline(
      Array.from({ length: FALLBACK_SAMPLES + 1 }, (_, index) =>
        spiralPoint(index / FALLBACK_SAMPLES),
      ),
      pose,
    )
    const facing = { pitch: 0, yaw: 0, roll: 0, scale: pose.scale }
    paths = [...orbits, spiral, ...ringStrands(ORBIT_CORE_SCALE, facing, 12)]
    dots = [
      ...Array.from({ length: ORBIT_COUNT }, (_, index) =>
        projectDot(planetPoint(index, 0), PLANET_RADII[index], pose),
      ),
      ...Array.from({ length: ORBIT_COUNT - 1 }, (_, index) =>
        projectDot(orbitPoint(index, 0), 0.03, pose),
      ),
    ]
  } else {
    paths = ringStrands(1, pose, 18)
  }
  return {
    paths,
    dots,
    satellite: projectDot(satellitePosition(weights, flowDrift(weights)), SATELLITE_RADIUS, pose),
  }
}
