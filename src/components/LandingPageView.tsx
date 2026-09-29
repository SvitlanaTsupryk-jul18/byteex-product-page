import type { LandingPage } from '@/types/content'
import { AnnouncementBar } from './sections/AnnouncementBar'
import { Header } from './sections/Header'
import { SectionRenderer } from './sections/SectionRenderer'

export function LandingPageView({ page }: { page: LandingPage }) {
  return (
    <>
      {/* React 19 hoists these tags into <head>. */}
      <title>{page.seo.title}</title>
      {page.seo.description && <meta name="description" content={page.seo.description} />}

      <AnnouncementBar items={page.announcements} />
      <Header />
      <main>
        {page.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} ratingText={page.ratingText} />
        ))}
      </main>
    </>
  )
}
