'use client'
import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches
}

// No servidor (e na primeira pintura, antes de sincronizar com o cliente)
// ninguém sabe a preferência do usuário, e o padrão seguro é não animar.
// Começar em `false` faria a órbita 3D montar por um frame para quem pediu
// movimento reduzido.
function getServerSnapshot(): boolean {
  return true
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
