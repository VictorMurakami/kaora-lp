import {
  BoxGeometry,
  CatmullRomCurve3,
  Color,
  Group,
  InstancedMesh,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  type BufferGeometry,
  type Material,
} from 'three'
import {
  FLOW_LANES,
  FLOW_PER_LANE,
  ORBIT_ARC,
  ORBIT_COUNT,
  ORBIT_RADII,
  ORBIT_TUBES,
  PLANET_RADII,
  RING_ARC,
  RING_RADIUS,
  RING_START,
  RING_TUBE,
  SATELLITE_RADIUS,
  crossingAngle,
  orbitPoint,
  ringCenter,
  spiralPoint,
} from './geometry'

/**
 * A torus whose triangles are ordered along the arc instead of around the
 * tube, so `setDrawRange` grows or erases it like a stroke: from the start of
 * the arc, or outward from its middle in both directions.
 */
function strokeTorus(
  radius: number,
  tube: number,
  radial: number,
  tubular: number,
  arc: number,
  from: 'start' | 'middle' = 'start',
) {
  const geometry = new TorusGeometry(radius, tube, radial, tubular, arc)
  const steps = Array.from({ length: tubular }, (_, index) => index + 1)
  if (from === 'middle') {
    const middle = (tubular + 1) / 2
    steps.sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle))
  }
  const indices: number[] = []
  for (const i of steps) {
    for (let j = 1; j <= radial; j++) {
      const a = (tubular + 1) * j + i - 1
      const b = (tubular + 1) * (j - 1) + i - 1
      const c = (tubular + 1) * (j - 1) + i
      const d = (tubular + 1) * j + i
      indices.push(a, b, d, b, c, d)
    }
  }
  geometry.setIndex(indices)
  return { geometry, trianglesPerStep: radial * 6, steps: tubular }
}

export type Stroke = { mesh: Mesh; trianglesPerStep: number; steps: number }

export function drawStroke(stroke: Stroke, fraction: number) {
  const steps = Math.round(Math.max(0, Math.min(1, fraction)) * stroke.steps)
  stroke.mesh.geometry.setDrawRange(0, steps * stroke.trianglesPerStep)
  stroke.mesh.visible = steps > 0
}

export function createOrbitalAssembly() {
  const root = new Group()
  root.rotation.order = 'ZYX'
  const geometries = new Set<BufferGeometry>()
  const materials = new Set<Material>()
  function track<T extends BufferGeometry>(geometry: T) {
    geometries.add(geometry)
    return geometry
  }
  function material(parameters: ConstructorParameters<typeof MeshPhysicalMaterial>[0]) {
    const created = new MeshPhysicalMaterial(parameters)
    materials.add(created)
    return created
  }

  const titanium = material({
    color: '#c4c7cc',
    metalness: 1,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
  })
  const copper = material({
    color: '#fa733c',
    metalness: 0.78,
    roughness: 0.24,
    clearcoat: 1,
    emissive: '#7a2105',
    emissiveIntensity: 0.2,
  })
  const rail = material({ color: '#9da1a8', metalness: 1, roughness: 0.3 })
  const glow = material({
    color: '#ffad63',
    metalness: 0.4,
    roughness: 0.35,
    emissive: '#ff6929',
    emissiveIntensity: 1.2,
  })
  const trailMaterial = material({
    color: '#ffad63',
    emissive: '#ff6929',
    emissiveIntensity: 1.4,
    metalness: 0.3,
    roughness: 0.4,
    transparent: true,
    opacity: 0.85,
  })
  const crossingGeometry = track(new SphereGeometry(0.032, 16, 12))
  const particleMaterial = material({
    color: '#ffffff',
    metalness: 0.55,
    roughness: 0.3,
    emissive: '#3a1204',
    emissiveIntensity: 0.4,
  })

  const ringGroup = new Group()
  const ringShape = strokeTorus(RING_RADIUS, RING_TUBE, 32, 240, RING_ARC)
  track(ringShape.geometry)
  const ringMesh = new Mesh(ringShape.geometry, titanium)
  ringMesh.rotation.z = RING_START
  const ring: Stroke = { mesh: ringMesh, ...ringShape }
  const capGeometry = track(new SphereGeometry(RING_TUBE, 32, 20))
  const startCap = new Mesh(capGeometry, titanium)
  const start = ringCenter(0)
  startCap.position.set(start.x, start.y, start.z)
  const endCap = new Mesh(capGeometry, titanium)
  ringGroup.add(ringMesh, startCap, endCap)
  root.add(ringGroup)

  const particleCount = FLOW_LANES * FLOW_PER_LANE
  const particles = new InstancedMesh(
    track(new BoxGeometry(1, 1, 1)),
    particleMaterial,
    particleCount,
  )
  const palette = {
    lead: new Color('#ffad63'),
    copper: new Color('#fa733c'),
    metal: new Color('#c9ccd1'),
  }
  const middle = (FLOW_LANES - 1) / 2
  for (let index = 0; index < particleCount; index++) {
    const lane = Math.floor(index / FLOW_PER_LANE)
    const distance = Math.abs(lane - middle)
    const tone =
      distance === 0
        ? palette.lead
        : distance === 1 || index % 11 === 0
          ? palette.copper
          : palette.metal
    particles.setColorAt(index, tone)
  }
  particles.frustumCulled = false
  root.add(particles)

  const orbitGroup = new Group()
  const tickGeometry = track(new BoxGeometry(1, 1, 1))
  const tickTransform = new Object3D()
  const orbits = Array.from({ length: ORBIT_COUNT }, (_, index) => {
    const radius = ORBIT_RADII[index]
    const shape = strokeTorus(radius, ORBIT_TUBES[index], 8, 300, ORBIT_ARC, 'middle')
    track(shape.geometry)
    const mesh = new Mesh(shape.geometry, index === ORBIT_COUNT - 1 ? titanium : rail)
    mesh.rotation.z = crossingAngle(index) - ORBIT_ARC / 2
    const planet = new Mesh(track(new SphereGeometry(PLANET_RADII[index], 32, 20)), titanium)
    const crossing = new Mesh(crossingGeometry, glow)
    const point = orbitPoint(index, 0)
    crossing.position.set(point.x, point.y, point.z)
    orbitGroup.add(mesh, planet, crossing)
    return { stroke: { mesh, ...shape } as Stroke, planet, crossing }
  })

  // Instrument ticks on the outer orbit, stored nearest-first so `count`
  // reveals them together with the stroke.
  const outer = ORBIT_RADII[ORBIT_COUNT - 1]
  const tickCount = 73
  const ticks = new InstancedMesh(tickGeometry, rail, tickCount)
  Array.from({ length: tickCount }, (_, tick) => (tick / (tickCount - 1) - 0.5) * ORBIT_ARC * 0.97)
    .sort((a, b) => Math.abs(a) - Math.abs(b))
    .forEach((offset, tick) => {
      const angle = crossingAngle(ORBIT_COUNT - 1) + offset
      const major = Math.abs(offset / (Math.PI / 6) - Math.round(offset / (Math.PI / 6))) < 0.03
      tickTransform.position.set(
        Math.cos(angle) * (outer + 0.07),
        Math.sin(angle) * (outer + 0.07),
        0,
      )
      tickTransform.rotation.set(0, 0, angle)
      tickTransform.scale.set(major ? 0.1 : 0.05, 0.006, 0.006)
      tickTransform.updateMatrix()
      ticks.setMatrixAt(tick, tickTransform.matrix)
    })
  ticks.frustumCulled = false
  orbitGroup.add(ticks)

  const spiralCurve = new CatmullRomCurve3(
    Array.from({ length: 161 }, (_, index) => {
      const point = spiralPoint(index / 160)
      return new Vector3(point.x, point.y, point.z)
    }),
  )
  const trailGeometry = track(new TubeGeometry(spiralCurve, 360, 0.0095, 6, false))
  const trail: Stroke = {
    mesh: new Mesh(trailGeometry, trailMaterial),
    trianglesPerStep: 6 * 6,
    steps: 360,
  }
  orbitGroup.add(trail.mesh)

  const halo = new Mesh(track(new TorusGeometry(0.4, 0.007, 8, 140)), glow)
  orbitGroup.add(halo)
  root.add(orbitGroup)

  const satellite = new Mesh(track(new SphereGeometry(SATELLITE_RADIUS, 48, 32)), copper)
  root.add(satellite)

  return {
    root,
    ringGroup,
    ring,
    startCap,
    endCap,
    particles,
    orbitGroup,
    orbits,
    ticks,
    tickCount,
    trail,
    halo,
    satellite,
    dispose() {
      particles.dispose()
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((item) => item.dispose())
    },
  }
}
