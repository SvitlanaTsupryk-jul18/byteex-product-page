import type { ReactNode } from 'react'

/**
 * Accepted payment methods shown under the final CTA.
 * Simplified 21x13 badges drawn in code as placeholders; replace them with the
 * official brand marks exported from Figma when available.
 */
const METHODS: { name: string; fill?: string; body: ReactNode }[] = [
  {
    name: 'American Express',
    fill: '#2e77bc',
    body: (
      <text x="10.5" y="8.3" fill="#fff" fontSize="4.2" fontWeight="700" textAnchor="middle">
        AMEX
      </text>
    ),
  },
  {
    name: 'Apple Pay',
    body: (
      <text x="10.5" y="8.4" fill="#000" fontSize="5" fontWeight="600" textAnchor="middle">
        Pay
      </text>
    ),
  },
  {
    name: 'Diners Club',
    body: (
      <g fill="none" stroke="#0079be" strokeWidth="1">
        <circle cx="9.3" cy="6.5" r="2.6" />
        <circle cx="11.7" cy="6.5" r="2.6" />
      </g>
    ),
  },
  {
    name: 'Discover',
    body: (
      <>
        <text x="9.3" y="7.8" fill="#231f20" fontSize="3" fontWeight="700" textAnchor="middle">
          DISCOVER
        </text>
        <circle cx="17.6" cy="6.8" r="1.1" fill="#f48120" />
      </>
    ),
  },
  {
    name: 'Google Pay',
    body: (
      <text x="10.5" y="8.3" fill="#5f6368" fontSize="4.4" fontWeight="600" textAnchor="middle">
        G Pay
      </text>
    ),
  },
  {
    name: 'Mastercard',
    body: (
      <>
        <circle cx="8.9" cy="6.5" r="3.2" fill="#eb001b" />
        <circle cx="12.1" cy="6.5" r="3.2" fill="#f79e1b" fillOpacity="0.9" />
      </>
    ),
  },
  {
    name: 'PayPal',
    body: (
      <text x="10.5" y="9" fill="#003087" fontSize="7" fontWeight="800" textAnchor="middle">
        P
      </text>
    ),
  },
  {
    name: 'Shop Pay',
    fill: '#5a31f4',
    body: (
      <text x="10.5" y="8.3" fill="#fff" fontSize="4.2" fontWeight="700" textAnchor="middle">
        Pay
      </text>
    ),
  },
  {
    name: 'Visa',
    body: (
      <text x="10.5" y="8.6" fill="#1a1f71" fontSize="5" fontWeight="800" textAnchor="middle">
        VISA
      </text>
    ),
  },
]

export function PaymentIcons({ className }: { className?: string }) {
  return (
    <ul aria-label="Accepted payment methods" className={className}>
      {METHODS.map((method) => (
        <li key={method.name} title={method.name}>
          <svg viewBox="0 0 21 13" className="h-[0.8125rem] w-[1.3125rem]" role="img">
            <title>{method.name}</title>
            <rect
              x="0.25"
              y="0.25"
              width="20.5"
              height="12.5"
              rx="2"
              fill={method.fill ?? '#fff'}
              stroke={method.fill ?? '#d9d9d9'}
              strokeWidth="0.5"
            />
            <g fontFamily="Arial, Helvetica, sans-serif">{method.body}</g>
          </svg>
        </li>
      ))}
    </ul>
  )
}
