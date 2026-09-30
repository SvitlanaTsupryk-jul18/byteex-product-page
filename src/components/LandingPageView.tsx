import type { LandingPage } from '@/types/content'
import { SeoTags } from './SeoTags'
import { AnnouncementBar } from './sections/AnnouncementBar'
import { Header } from './sections/Header'
import { SectionRenderer } from './sections/SectionRenderer'

export function LandingPageView({ page }: { page: LandingPage }) {
  return (
    <>
      <SeoTags page={page} />

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
