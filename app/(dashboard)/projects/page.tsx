'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Project } from '@/types'
import { Plus, Clock, TrendingUp } from 'lucide-react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadProjects = async () => {
      try {
        const projectsRef = collection(db, 'projects')
        const q = query(
          projectsRef,
          where('userId', '==', user.id),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        const projectsData = querySnapshot.docs.map(doc => doc.data() as Project)
        setProjects(projectsData)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [user])

  const difficultyColors = {
    beginner: 'text-green',
    intermediate: 'text-amber',
    advanced: 'text-red-500',
  }

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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-dark-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-dark-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-dark-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="card hover:border-amber group cursor-pointer transition-all"
            >
              <h3 className="font-semibold text-lg mb-3 group-hover:text-amber transition-colors">
                {project.title}
              </h3>

              <div className="space-y-2 text-sm text-dark-300">
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{project.instructions.timeEstimate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} />
                  <span className={difficultyColors[project.difficulty]}>
                    {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-700">
                <p className="text-xs text-dark-400">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
