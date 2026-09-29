/**
 * Initial landing page content, taken from the Figma mockup.
 *
 * Used in two places:
 * 1. scripts/contentful/seed.ts uploads it to Contentful.
 * 2. The app falls back to it when Contentful env variables are missing,
 *    so the page can be developed without CMS credentials.
 *
 * Image urls stay empty here. The seed script uploads matching files from
 * scripts/contentful/images/<image id>.<ext> when they exist.
 */
import type { Cta, Feature, Image, LandingPage, Testimonial } from '../types/content.ts'

const LOREM_SHORT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis sapien facilisis tincidunt pellentesque. In eget ipsum et felis finibus consequat.'

const LOREM_REVIEW =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed sollicitudin dolor, non sodales justo. Aenean eget aliquet mi.'

const image = (id: string, alt: string): Image => ({ id, url: '', alt })

const images = (prefix: string, count: number, alt: string): Image[] =>
  Array.from({ length: count }, (_, i) => image(`${prefix}-${i + 1}`, `${alt} ${i + 1}`))

const PRIMARY_CTA: Cta = { label: 'Customize Your Outfit', href: '#shop' }

const reviewer = (id: string, quote: string): Testimonial => ({
  id,
  author: 'Jane, S.',
  rating: 5,
  quote,
})

const benefit = (id: string, title: string, icon: Feature['icon']): Feature => ({
  id,
  title,
  description: LOREM_SHORT,
  icon,
})

export const landingPageContent: LandingPage = {
  slug: 'home',
  seo: {
    title: 'Byteex | Comfortable Loungewear',
    description:
      'Beautiful, comfortable loungewear for day or night. Ethically sourced and responsibly made.',
  },
  announcements: [
    'CONSCIOUSLY MADE BUTTER SOFT STAPLES FOR EVERY DAY (OR NIGHT)',
    'FREE SHIPPING on orders > $200',
    'easy 45 day return window.',
  ],
  ratingText: 'Over 500+ 5 Star Reviews Online',
  sections: [
    {
      type: 'hero',
      id: 'section-hero',
      heading: 'Don’t apologize for being comfortable.',
      features: [
        {
          id: 'hero-feature-1',
          title: 'Beautiful, comfortable loungewear for day or night.',
          icon: 'dayNight',
        },
        {
          id: 'hero-feature-2',
          title: 'No wasteful extras, like tags or plastic packaging.',
          icon: 'ecoCart',
        },
        {
          id: 'hero-feature-3',
          title:
            'Our signature fabric is incredibly comfortable — unlike anything you’ve ever felt.',
          icon: 'waves',
        },
      ],
      cta: PRIMARY_CTA,
      testimonial: {
        id: 'testimonial-amy',
        author: 'Amy P.',
        rating: 5,
        badge: 'One of 500+ 5 Star Reviews Online',
        quote:
          'Overjoyed with my Loungewear set. I have the jogger and the sweatshirt. Quality product on every level. From the compostable packaging, to the supplied washing bag, even the garments smells like fresh herbs when I first held them.',
        avatar: image('avatar-amy', 'Amy P.'),
      },
      images: [
        // One composed collage exported from Figma (three photos + backdrop).
        image(
          'hero',
          'Three women relaxing in Byteex loungewear: a cropped set, a white robe and a set worn while reading',
        ),
      ],
      pressHeading: 'as seen in',
      pressLogos: [
        image('press-eco-stylist', 'Eco-Stylist'),
        image('press-canadian-living', 'Canadian Living'),
        image('press-jillian-harris', 'Jillian Harris'),
        image('press-eco-hub', 'The Eco Hub'),
        image('press-trendhunter', 'Trend Hunter'),
      ],
    },
    {
      type: 'benefits',
      id: 'section-benefits',
      heading: 'Loungewear you can be proud of.',
      features: [
        benefit('benefit-1', 'Ethically sourced.', 'ecoCart'),
        benefit('benefit-2', 'Responsibly made.', 'leaf'),
        benefit('benefit-3', 'Made for living in.', 'dayNight'),
        benefit('benefit-4', 'Unimaginably comfortable.', 'waves'),
      ],
      product: {
        id: 'product-white-robe',
        name: 'White Robe',
        images: [
          image('product-robe-1', 'Woman in the white robe'),
          image('product-robe-2', 'Woman in a cropped loungewear set'),
          ...[3, 4, 5, 6, 7, 8].map((n) => image(`product-robe-${n}`, `White robe, photo ${n}`)),
        ],
      },
      cta: PRIMARY_CTA,
    },
    {
      type: 'founder',
      id: 'section-founder',
      heading: 'Be your best self.',
      paragraphs: [
        'Hi! My name’s [Insert Name], and I founded [Insert] in ____.',
        LOREM_SHORT,
        'Fusce non nibh luctus, dignissim risus quis, bibendum dolor. Donec placerat volutpat ligula, ac consectetur felis varius non. Aliquam a nunc rutrum, porttitor dolor eu, pellentesque est. Vivamus id arcu congue, faucibus libero nec, placerat ligula.',
        'Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed eu nisl a metus ultrices sodales.',
        'Fusce non ante velit. Sed auctor odio eu semper molestie. Nam mattis, sapien eget lobortis fringilla, eros ipsum tristique tellus, ac convallis urna massa at nibh.',
        'Duis non fermentum augue. Vivamus laoreet aliquam risus, sed euismod leo aliquam ut. Vivamus in felis eu lacus feugiat aliquam nec in sapien.',
        'Cras mattis varius mollis.',
      ],
      images: [
        image('founder-1', 'Founder in a white robe'),
        image('founder-2', 'Woman in a cropped loungewear set'),
        image('founder-3', 'Woman opening the curtains by the window'),
      ],
      cta: PRIMARY_CTA,
    },
    {
      type: 'steps',
      id: 'section-steps',
      heading: 'Comfort made easy',
      steps: [
        {
          id: 'step-save',
          title: 'You save.',
          description: 'Browse our comfort sets and save 15% when you bundle.',
          icon: 'ecoCart',
        },
        {
          id: 'step-ship',
          title: 'We ship.',
          description: 'We ship your items within 1-2 days of receiving your order.',
          icon: 'truck',
        },
        {
          id: 'step-enjoy',
          title: 'You enjoy!',
          description: 'Wear hernest around the house, out on the town, or in bed.',
          icon: 'sun',
        },
      ],
      cta: PRIMARY_CTA,
    },
    {
      type: 'reviews',
      id: 'section-reviews',
      heading: 'What are our fans saying?',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis sapien facilisis tincidunt pellentesque. In eget ipsum et felis finibus consequat. Fusce non nibh luctus.',
      gallery: images('ugc', 22, 'Customer photo'),
      testimonials: [
        reviewer('review-1', LOREM_REVIEW),
        reviewer(
          'review-2',
          `${LOREM_REVIEW} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed sollicitudin dolor, non sodales.`,
        ),
        reviewer('review-3', LOREM_REVIEW),
        reviewer('review-4', LOREM_REVIEW),
        reviewer('review-5', LOREM_REVIEW),
      ],
      cta: PRIMARY_CTA,
    },
    {
      type: 'faq',
      id: 'section-faq',
      heading: 'Frequently asked questions.',
      items: Array.from({ length: 6 }, (_, i) => ({
        id: `faq-${i + 1}`,
        question: 'lorem ipsum dolor sit amet',
        answer:
          i === 0
            ? 'Our fabrics and garments are made in Portugal. We build strong relationships with our immediate suppliers and visit as often as possible.'
            : LOREM_SHORT,
      })),
      images: [
        image('faq-1', 'Woman stretching in a green set'),
        image('faq-2', 'Woman in a cropped loungewear set'),
        image('faq-3', 'Woman reading in bed'),
      ],
      cta: PRIMARY_CTA,
    },
    {
      type: 'impact',
      id: 'section-impact',
      heading: 'Our total green impact',
      stats: [
        { id: 'impact-co2', title: '3,927 kg', description: 'of CO2 saved', icon: 'cloud' },
        {
          id: 'impact-water',
          title: '2,546,167 days',
          description: 'of drinking water saved',
          icon: 'drop',
        },
        { id: 'impact-energy', title: '7,321 kWh', description: 'of energy saved', icon: 'bolt' },
      ],
    },
    {
      type: 'cta',
      id: 'section-cta',
      heading: 'Find something you love.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis sapien facilisis tincidunt pellentesque. In eget ipsum et felis finibus consequat.',
      images: [
        image('cta-1', 'Woman in a green loungewear set'),
        image('cta-2', 'Woman in a patterned yellow set'),
        image('cta-3', 'Woman in a cropped loungewear set'),
      ],
      cta: PRIMARY_CTA,
      shippingNote: 'Ships in 1-2 Days',
      perks: [
        { id: 'perk-shipping', title: 'FREE Shipping on Orders over $200', icon: 'truck' },
        { id: 'perk-reviews', title: 'Over 500+ 5 Star Reviews Online', icon: 'shield' },
        { id: 'perk-ethics', title: 'Made ethically and responsibly.', icon: 'hanger' },
      ],
    },
  ],
}
