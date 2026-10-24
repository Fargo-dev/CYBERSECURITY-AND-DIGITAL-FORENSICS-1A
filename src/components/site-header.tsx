import { Link } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display font-semibold"
        >
          <span className="grid size-8 place-items-center rounded-md bg-accent text-accent-foreground">
            <ShieldCheck className="size-4" aria-hidden />
          </span>
          <span className="leading-tight">
            BSc. CyberSec &amp; DF <span className="text-accent">1A</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className="rounded-md px-3 py-1.5 text-primary-foreground/75 transition-colors hover:text-primary-foreground motion-reduce:transition-none"
            activeProps={{ className: 'bg-white/10 !text-primary-foreground' }}
            activeOptions={{ exact: true }}
          >
            Register
          </Link>
          <Link
            to="/class-list"
            className="rounded-md px-3 py-1.5 text-primary-foreground/75 transition-colors hover:text-primary-foreground motion-reduce:transition-none"
            activeProps={{ className: 'bg-white/10 !text-primary-foreground' }}
          >
            Class list
          </Link>
        </nav>
      </div>
    </header>
  )
}
