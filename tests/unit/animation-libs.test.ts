import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// GSAP was removed in favour of anime.js. It cost zero rework because no code used GSAP yet — only
// `gsapDuration` in src/design-system/motion.ts referenced it, and that was a
// unit converter, not GSAP itself. This test is a cheap guard against someone
// reinstalling GSAP later and quietly ending up with two animation engines
// covering the same ground.
//
// `@react-three/fiber` and `@react-three/drei` guard a related decision:
// Task 22 prototyped three hero variants (one of them a 3D particle field),
// the client picked the canvas-2D variant, and Task 21 deleted
// `src/app/preview` and these packages once that decision was made. The
// record lives in git history and the client's notes, not in a second
// renderer nobody ships.
//
// `three` drives the hero sculpture directly. R3F and drei stay banned — the
// scene is driven without a React reconciler for the scene graph.
const PACKAGE_JSON = join(__dirname, '..', '..', 'package.json')

describe('animation library dependencies', () => {
  const pkg = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8')) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }

  it('does not depend on gsap', () => {
    expect(allDeps).not.toHaveProperty('gsap')
  })

  it('depends on animejs', () => {
    expect(allDeps).toHaveProperty('animejs')
  })

  it('depends on three', () => {
    expect(allDeps).toHaveProperty('three')
  })

  it('does not depend on @react-three/fiber', () => {
    expect(allDeps).not.toHaveProperty('@react-three/fiber')
  })

  it('does not depend on @react-three/drei', () => {
    expect(allDeps).not.toHaveProperty('@react-three/drei')
  })
})
