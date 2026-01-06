'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Home, FolderOpen, Settings, LogOut, Sparkles, Crown } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Projects', href: '/projects', icon: FolderOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="flex flex-col h-full bg-dark-900 border-r border-dark-700">
      {/* Logo */}
      <div className="p-6 border-b border-dark-700">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-amber rounded-lg flex items-center justify-center text-black font-bold text-xl">
            D
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold">
              DIY<span className="text-amber">Tutor</span>
            </h1>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.href)
                  ? 'bg-amber text-black font-semibold'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-dark-700">
        {/* Plan Badge */}
        {user && (
          <div className="mb-4">
            {user.plan === 'pro' ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber to-yellow-500 rounded-lg text-black">
                <Crown size={16} />
                <span className="text-sm font-semibold">Pro Plan</span>
              </div>
            ) : (
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-300 hover:text-white hover:border-amber transition-colors"
              >
                <Sparkles size={16} />
                <span className="text-sm">Upgrade to Pro</span>
              </Link>
            )}
          </div>
        )}

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-amber rounded-full flex items-center justify-center text-black font-semibold">
              {user.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-dark-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Sign Out */}
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-dark-300 hover:text-white hover:bg-dark-800 transition-all"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
