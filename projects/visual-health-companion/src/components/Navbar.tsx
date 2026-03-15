'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-slate-700 bg-slate-900 bg-opacity-50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          🪞 Health Companion
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-300 hover:text-white">
                Dashboard
              </Link>
              <span className="text-sm text-gray-400">{session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="btn-primary px-4 py-2 text-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
