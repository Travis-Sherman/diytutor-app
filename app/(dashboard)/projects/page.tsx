'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">My Projects</h1>
          <p className="text-dark-300">
            All your DIY project instructions in one place
          </p>
        </div>
        <Link href="/projects/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          New Project
        </Link>
      </div>

      {/* Empty State */}
      <div className="card">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center text-dark-400 mx-auto mb-6">
            <Plus size={40} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-dark-400 mb-6 max-w-md mx-auto">
            Start your first DIY project and get detailed, step-by-step instructions powered by AI.
          </p>
          <Link href="/projects/new" className="btn-primary inline-flex items-center gap-2">
            <Plus size={20} />
            Create Your First Project
          </Link>
        </div>
      </div>
    </div>
  )
}
