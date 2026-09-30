import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SRC_DIR = join(__dirname, '..', '..', 'src')

// This file only mentions the bug pattern inside a comment, as documentation
// for an inline-style workaround pending removal once the primitive itself is
// fixed — it contains no live Tailwind usage of the pattern. Excluding it here
// avoids a false positive on prose that quotes the very string this test looks
// for; it is not a carve-out for real component code.
const EXCLUDED_FILES = [
  join(SRC_DIR, 'app', 'design-system', '_components', 'DesignSystemContent.tsx'),
]

function collectTsxFiles(dir: string): string[] {
  const entries = readdirSync(dir)
  return entries.flatMap((entry) => {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) return collectTsxFiles(full)
    if (full.endsWith('.tsx') && !EXCLUDED_FILES.includes(full)) return [full]
    return []
  })
}

// Tailwind cannot infer whether `text-[var(--foo)]` is a font-size or a colour
// utility, and silently guesses. Any arbitrary `text-[var(--text-…)]` names a
// SIZE token but is missing the `length:` type hint, so Tailwind compiles it as
// `color`, which then falls back to inherited colour because a clamp() is not a
// valid colour value. `text-[var(--color-…)]` is a legitimate colour utility and
// must not be flagged.
const UNHINTED_SIZE_TEXT_UTILITY = /text-\[var\(--text-[\w-]+\)\]/g

describe('tailwind arbitrary text-[] type hints', () => {
  const files = collectTsxFiles(SRC_DIR)

  it('has at least one .tsx file to check', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  for (const file of files) {
    it(`${file.replace(SRC_DIR, 'src')} has no unhinted text-[var(--text-…)] utility`, () => {
      const contents = readFileSync(file, 'utf8')
      const matches = contents.match(UNHINTED_SIZE_TEXT_UTILITY) ?? []
      expect(
        matches,
        `Found arbitrary text-[var(--text-…)] without a "length:" type hint in ${file}. ` +
          `Tailwind compiles this as a colour utility, which silently breaks with a clamp() value. ` +
          `Use text-[length:var(--text-…)] instead.`,
      ).toEqual([])
    })
  }
})
