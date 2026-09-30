'use client'

import { useState } from 'react'

export function ModeButtons({ modes }: { modes: readonly string[] }) {
  const [mode, setMode] = useState(0)
  return (
    <div
      className="experiment-controls"
      role="group"
      aria-label="Perspectiva da escultura (amostra)"
    >
      {modes.map((label, index) => (
        <button
          key={label}
          type="button"
          aria-pressed={mode === index}
          onClick={() => setMode(index)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
