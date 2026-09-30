'use client'

import { useState } from 'react'
import { Check, Circle, Layers } from 'lucide-react'
import { Symbol } from '@/components/brand/Symbol'
import type { Dictionary } from '@/content'

type Filter = 'all' | 'active' | 'done'
const shownTasks = 3

// Reduced copy of the landing workspace: same classes, no scroll tilt and no list animation.
export function WorkspaceExcerpt({ copy }: { copy: Dictionary['playground'] }) {
  const [completed, setCompleted] = useState([true, true, false])
  const [filter, setFilter] = useState<Filter>('all')
  const progress = Math.round((completed.filter(Boolean).length / shownTasks) * 100)

  return (
    <div className="workspace-demo" data-testid="workspace-sample">
      <div className="workspace-toolbar">
        <span>
          <Symbol className="size-5" decorative />
          kaora<span className="workspace-divider">/</span>
          <span className="workspace-name">{copy.workspace}</span>
        </span>
      </div>
      <div className="workspace-body">
        <div className="workspace-breadcrumb">
          <Layers size={14} aria-hidden />
          {copy.overview}
        </div>
        <div className="workspace-project-icon" aria-hidden>
          <Layers size={23} />
        </div>
        <p className="text-[1.4rem] font-medium tracking-[-0.035em]">{copy.project}</p>
        <p className="workspace-description">{copy.description}</p>
        <div className="project-progress">
          <div>
            <span>{copy.progress}</span>
            <strong>{progress}%</strong>
          </div>
          <div
            role="progressbar"
            aria-label={copy.progress}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="progress-track"
          >
            <span style={{ transform: `scaleX(${progress / 100})` }} />
          </div>
        </div>
        <div className="task-filters" role="group" aria-label={copy.navigation}>
          {(['all', 'active', 'done'] as const).map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {copy[value]}
            </button>
          ))}
        </div>
        <div className="task-list">
          {copy.tasks.slice(0, shownTasks).map((task, index) => {
            if (
              (filter === 'active' && completed[index]) ||
              (filter === 'done' && !completed[index])
            )
              return null
            return (
              <button
                key={task}
                type="button"
                className="task-row"
                aria-pressed={completed[index]}
                aria-label={`${copy.taskAction} ${task}`}
                onClick={() =>
                  setCompleted((previous) =>
                    previous.map((value, taskIndex) => (taskIndex === index ? !value : value)),
                  )
                }
              >
                <span className="task-check">
                  {completed[index] ? (
                    <Check size={12} aria-hidden />
                  ) : (
                    <Circle size={16} aria-hidden />
                  )}
                </span>
                <span className="task-name">{task}</span>
                <span className="task-tag">{copy.tags[index]}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="workspace-tip">
        <span className="status-dot" />
        {copy.tip}
      </div>
    </div>
  )
}
