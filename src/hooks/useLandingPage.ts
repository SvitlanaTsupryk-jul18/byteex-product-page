import { useCallback, useEffect, useState } from 'react'
import { getLandingPage } from '@/lib/content'
import type { LandingPage } from '@/types/content'

export type LandingPageState =
  | { status: 'loading' }
  | { status: 'error'; error: Error; retry: () => void }
  | { status: 'success'; page: LandingPage }

export function useLandingPage(slug: string): LandingPageState {
  const [state, setState] = useState<LandingPageState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((value) => value + 1)
  }, [])

  useEffect(() => {
    let active = true

    getLandingPage(slug)
      .then((page) => {
        if (active) setState({ status: 'success', page })
      })
      .catch((error: unknown) => {
        if (!active) return
        const normalized = error instanceof Error ? error : new Error(String(error))
        setState({ status: 'error', error: normalized, retry })
      })

    return () => {
      active = false
    }
  }, [slug, attempt, retry])

  return state
}
