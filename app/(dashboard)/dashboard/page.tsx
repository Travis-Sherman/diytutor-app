'use client'

import { useAuth } from '@/hooks/useAuth'
import { Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()

  const usagePercentage = user ? (user.projectsUsedThisMonth / (user.plan === 'pro' ? 50 : 3)) * 100 : 0
  const projectsRemaining = user ? (user.plan === 'pro' ? 50 : 3) - user.projectsUsedThisMonth : 0

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">
          Welcome back, {user?.displayName}!
        </h1>
        <p className="text-dark-300">
          Ready to build something amazing today?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* New Project Card */}
        <Link
          href="/projects/new"
          className="card hover:border-amber group cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber rounded-lg flex items-center justify-center text-black group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">New Project</h3>
              <p className="text-sm text-dark-400">
                Start generating your next DIY project
              </p>
            </div>
          </div>
        </Link>

        {/* Usage Card */}
        <div className="card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center text-amber">
              <Sparkles size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Usage This Month</h3>
              <p className="text-sm text-dark-400 mb-3">
                {projectsRemaining} project{projectsRemaining !== 1 ? 's' : ''} remaining
              </p>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div
                  className="bg-amber h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Plan Card */}
        <div className="card">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              user?.plan === 'pro'
                ? 'bg-gradient-to-r from-amber to-yellow-500 text-black'
                : 'bg-dark-700 text-dark-300'
            }`}>
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">
                {user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
              </h3>
              {user?.plan === 'pro' ? (
                <p className="text-sm text-dark-400">
                  Enjoy unlimited features
                </p>
              ) : (
                <Link
                  href="/settings"
                  className="text-sm text-amber hover:text-amber-400"
                >
                  Upgrade to Pro →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="card">
        <h2 className="text-xl font-heading font-bold mb-4">Recent Projects</h2>
        <div className="text-center py-12 text-dark-400">
          <p className="mb-4">No projects yet</p>
          <Link
            href="/projects/new"
            className="btn-primary inline-block"
          >
            Create Your First Project
          </Link>
        </div>
      </div>
    </div>
  )
}
