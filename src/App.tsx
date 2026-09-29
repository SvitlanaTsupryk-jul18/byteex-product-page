import { LandingPageView } from '@/components/LandingPageView'
import { PageError, PageSkeleton } from '@/components/PageStatus'
import { useLandingPage } from '@/hooks/useLandingPage'
import { LANDING_PAGE_SLUG } from '@/lib/contentful/contentTypes'

export default function App() {
  const state = useLandingPage(LANDING_PAGE_SLUG)

  switch (state.status) {
    case 'loading':
      return <PageSkeleton />
    case 'error':
      return <PageError message={state.error.message} onRetry={state.retry} />
    case 'success':
      return <LandingPageView page={state.page} />
  }
}
