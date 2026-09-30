import { useCallback, useEffect, useState } from 'react'
import { getLandingPage, getSnapshotPage } from '@/lib/content'
import type { LandingPage } from '@/types/content'

export type LandingPageState =
  | { status: 'loading' }
  | { status: 'error'; error: Error; retry: () => void }
  | { status: 'success'; page: LandingPage }

/**
 * Loads the landing page. With a build-time snapshot the page renders immediately
 * and is refreshed from Contentful in the background (stale-while-revalidate).
 */
export function useLandingPage(slug: string): LandingPageState {
  const [state, setState] = useState<LandingPageState>(() => {
    const snapshot = getSnapshotPage()
    return snapshot ? { status: 'success', page: snapshot } : { status: 'loading' }
  })
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
        // Keep showing the snapshot if the background refresh fails.
        setState((current) =>
          current.status === 'success' ? current : { status: 'error', error: normalized, retry },
        )
      })

    return () => {
      active = false
    }
  }, [slug, attempt, retry])

  return state
}
