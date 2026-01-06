'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProjectPage() {
  const [projectIdea, setProjectIdea] = useState('')
  const [generating, setGenerating] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectIdea.trim()) {
      toast.error('Please enter a project idea')
      return
    }

    if (!user) {
      toast.error('You must be logged in')
      return
    }

    setGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIdea: projectIdea.trim(),
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate project')
      }

      toast.success('Project generated successfully!')
      router.push(`/projects/${data.project.id}`)

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate project')
    } finally {
      setGenerating(false)
    }
  }

  const projectsRemaining = user ? (user.plan === 'pro' ? 50 : 3) - user.projectsUsedThisMonth : 0

  return (
    <div className="p-8">
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
        <h1 className="text-3xl font-heading font-bold mb-2">Create New Project</h1>
        <p className="text-dark-300">
          Tell us what you want to build and we&apos;ll generate detailed, step-by-step instructions
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Usage Info */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={20} className="text-amber" />
            <span className="font-semibold">
              {projectsRemaining} project{projectsRemaining !== 1 ? 's' : ''} remaining this month
            </span>
          </div>
          {user?.plan === 'free' && projectsRemaining <= 1 && (
            <p className="text-sm text-dark-400">
              Upgrade to Pro for 50 projects per month.{' '}
              <Link href="/settings" className="text-amber hover:text-amber-400">
                Learn more →
              </Link>
            </p>
          )}
        </div>

        {/* Generation Form */}
        <form onSubmit={handleGenerate} className="card">
          <label htmlFor="projectIdea" className="block text-sm font-medium mb-3">
            What do you want to build?
          </label>
          <textarea
            id="projectIdea"
            value={projectIdea}
            onChange={(e) => setProjectIdea(e.target.value)}
            placeholder="E.g., A wooden coffee table with storage, A home automation system with Raspberry Pi, A vertical herb garden for my balcony..."
            className="input-field min-h-[150px] resize-y mb-6"
            required
            disabled={generating}
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={generating || projectsRemaining <= 0}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Instructions
                </>
              )}
            </button>

            <Link href="/projects" className="btn-secondary">
              Cancel
            </Link>
          </div>

          {projectsRemaining <= 0 && (
            <p className="text-sm text-red-500 mt-4">
              You&apos;ve reached your monthly limit.{' '}
              <Link href="/settings" className="underline">
                Upgrade to Pro
              </Link>
            </p>
          )}
        </form>

        {/* Examples */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-dark-400 mb-3">Example project ideas:</h3>
          <div className="grid gap-2">
            {[
              'Build a raised garden bed for vegetables',
              'Create a smart mirror with Raspberry Pi',
              'Make floating shelves for my living room',
              'Build a workbench for my garage',
              'Create a LED light strip setup for my desk',
            ].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setProjectIdea(example)}
                className="text-left px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-300 hover:text-white hover:border-amber transition-colors"
                disabled={generating}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
