'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Project } from '@/types'
import { ArrowLeft, Clock, TrendingUp, Package, Wrench, AlertTriangle, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function ProjectViewPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadProject = async () => {
      try {
        const projectRef = doc(db, 'projects', params.id as string)
        const projectDoc = await getDoc(projectRef)

        if (!projectDoc.exists()) {
          router.push('/projects')
          return
        }

        const projectData = projectDoc.data() as Project

        // Check if user owns this project
        if (projectData.userId !== user.id) {
          router.push('/projects')
          return
        }

        setProject(projectData)
      } catch (error) {
        console.error('Error loading project:', error)
        router.push('/projects')
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [params.id, user, router])

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-dark-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-dark-800 rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-dark-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  const { instructions } = project
  const difficultyColors = {
    beginner: 'text-green',
    intermediate: 'text-amber',
    advanced: 'text-red-500',
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-dark-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-4">{project.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber" />
              <span className="text-dark-300">{instructions.timeEstimate}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-amber" />
              <span className={difficultyColors[instructions.difficulty]}>
                {instructions.difficulty.charAt(0).toUpperCase() + instructions.difficulty.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="card mb-6">
          <h2 className="text-xl font-heading font-bold mb-3">Overview</h2>
          <p className="text-dark-300 leading-relaxed">{instructions.overview}</p>
        </div>

        {/* Materials */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Package size={24} className="text-amber" />
            <h2 className="text-xl font-heading font-bold">Materials Needed</h2>
          </div>
          <div className="space-y-3">
            {instructions.materials.map((material, index) => (
              <div
                key={index}
                className="flex justify-between items-center pb-3 border-b border-dark-700 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{material.name}</p>
                  <p className="text-sm text-dark-400">{material.quantity}</p>
                </div>
                <span className="text-amber font-semibold">{material.estimated_cost}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-dark-700">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Estimated Cost:</span>
              <span className="text-xl font-bold text-amber">
                $
                {instructions.materials
                  .reduce((sum, m) => sum + parseFloat(m.estimated_cost.replace('$', '')), 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Wrench size={24} className="text-amber" />
            <h2 className="text-xl font-heading font-bold">Tools Required</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {instructions.tools.map((tool, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg"
              >
                <div className="w-2 h-2 bg-amber rounded-full" />
                <span className="text-sm">
                  {tool.name}
                  {tool.optional && <span className="text-dark-400 ml-1">(optional)</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-bold">Instructions</h2>
          {instructions.steps.map((step) => (
            <div key={step.stepNumber} className="card">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber rounded-lg flex items-center justify-center text-black font-bold">
                  {step.stepNumber}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                  <p className="text-dark-300 mb-4 leading-relaxed">{step.description}</p>

                  {/* Tips */}
                  {step.tips && step.tips.length > 0 && (
                    <div className="mb-4 p-3 bg-dark-900 border border-dark-700 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <Lightbulb size={16} className="text-amber mt-0.5" />
                        <span className="text-sm font-semibold">Tips:</span>
                      </div>
                      <ul className="space-y-1 ml-6">
                        {step.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-dark-300">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Warnings */}
                  {step.warnings && step.warnings.length > 0 && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertTriangle size={16} className="text-red-500 mt-0.5" />
                        <span className="text-sm font-semibold text-red-500">Safety Warning:</span>
                      </div>
                      <ul className="space-y-1 ml-6">
                        {step.warnings.map((warning, i) => (
                          <li key={i} className="text-sm text-red-400">
                            • {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex gap-4">
          <button className="btn-primary">
            Export to PDF
          </button>
          <button className="btn-secondary">
            Share Project
          </button>
        </div>
      </div>
    </div>
  )
}
