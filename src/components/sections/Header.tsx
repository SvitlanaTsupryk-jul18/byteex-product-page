import { Logo } from '../ui/Logo'

export function Header() {
  return (
    <header className="container-page flex justify-center pt-3 lg:justify-start lg:pt-8">
      <a href="./" aria-label="Byteex home" className="text-black">
        <Logo className="h-9 w-auto" />
      </a>
    </header>
  )
}
