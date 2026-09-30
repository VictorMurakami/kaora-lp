'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { springs } from '@/design-system/motion'
import { interaction } from '@/design-system/interaction'
import { ArrowUpRight, Check, Circle, Layers, RotateCcw } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Symbol } from '@/components/brand/Symbol'
import type { Dictionary } from '@/content'

type TaskFilter = 'all' | 'active' | 'done'
const initialTasks = [true, true, false, false]

export function Playground({ copy }: { copy: Dictionary['playground'] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  })
  const rotation = useTransform(scrollYProgress, [0, 1], [interaction.workspace.rotation, 0])
  const entrance = useTransform(scrollYProgress, [0, 1], [interaction.workspace.entrance, 0])
  const [completed, setCompleted] = useState(initialTasks)
  const [filter, setFilter] = useState<TaskFilter>('all')
  const completedCount = completed.filter(Boolean).length
  const progress = (completedCount / completed.length) * 100

  function toggleTask(index: number) {
    setCompleted((previous) =>
      previous.map((value, taskIndex) => (taskIndex === index ? !value : value)),
    )
  }

  return (
    <section ref={sectionRef} id="playground" className="content-section playground-section">
      <Container>
        <SectionLabel number="02">{copy.label}</SectionLabel>
        <div className="playground-grid">
          <div className="playground-copy">
            <h2 className="section-title" data-reveal>
              {copy.title}
              <span className="muted-heading">{copy.accent}</span>
            </h2>
            <p className="section-description">{copy.body}</p>
            <div className="playground-note">
              <span className="status-dot" />
              {copy.note}
            </div>
            <ArrowUpRight className="playground-arrow" size={72} strokeWidth={1} aria-hidden />
          </div>
          <motion.div
            className="workspace-demo"
            style={reducedMotion ? undefined : { rotate: rotation, y: entrance }}
          >
            <div className="workspace-toolbar">
              <span>
                <Symbol className="size-5" />
                kaora<span className="workspace-divider">/</span>
                <span className="workspace-name">{copy.workspace}</span>
              </span>
              <button
                type="button"
                aria-label={copy.reset}
                title={copy.reset}
                onClick={() => {
                  setCompleted(initialTasks)
                  setFilter('all')
                }}
              >
                <RotateCcw size={16} aria-hidden />
              </button>
            </div>
            <div className="workspace-body">
              <div className="workspace-breadcrumb">
                <Layers size={14} aria-hidden />
                {copy.overview}
                <span>↗</span>
              </div>
              <div className="workspace-project-icon" aria-hidden>
                <Layers size={23} />
              </div>
              <h3>{copy.project}</h3>
              <p className="workspace-description">{copy.description}</p>
              <div className="project-progress">
                <div>
                  <span>{copy.progress}</span>
                  <strong aria-live="polite">{progress}%</strong>
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
                <AnimatePresence initial={false} mode="popLayout">
                  {copy.tasks.map((task, index) => {
                    if (
                      (filter === 'active' && completed[index]) ||
                      (filter === 'done' && !completed[index])
                    )
                      return null
                    return (
                      <motion.button
                        layout={reducedMotion ? false : 'position'}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reducedMotion ? 0 : -interaction.revealDistance }}
                        transition={reducedMotion ? { duration: 0 } : springs.snappy}
                        key={task}
                        type="button"
                        className="task-row"
                        aria-pressed={completed[index]}
                        aria-label={`${copy.taskAction} ${task}`}
                        onClick={() => toggleTask(index)}
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
                      </motion.button>
                    )
                  })}
                </AnimatePresence>
                {completed.every((value) =>
                  filter === 'active' ? value : filter === 'done' ? !value : false,
                ) && (
                  <p className="task-empty" role="status">
                    {copy.empty}
                  </p>
                )}
              </div>
              <div className="workspace-footer">
                <span aria-live="polite">
                  {completedCount}/{completed.length} {copy.complete}
                </span>
                <span className="team-avatars" aria-label={copy.team}>
                  <span>K</span>
                  <span>A</span>
                  <span>+1</span>
                </span>
              </div>
            </div>
            <div className="workspace-tip">
              <span className="status-dot" />
              {copy.tip}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
