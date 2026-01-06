'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // Check if dismissed recently (7 days)
    const dismissedDate = localStorage.getItem('pwa-install-dismissed')
    if (dismissedDate) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedDate)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) {
        return
      }
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setShowPrompt(false)
        setDeferredPrompt(null)
      }
    } catch (error) {
      console.error('Install prompt error:', error)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 bg-amber rounded-lg flex items-center justify-center text-black font-bold text-xl">
                D
              </div>
              <div>
                <h3 className="font-semibold text-white">Install DIYTutor</h3>
                <p className="text-sm text-dark-300">Get the best experience</p>
              </div>
            </div>
            <p className="text-sm text-dark-400 mt-2">
              Install our app for faster access, offline support, and an app-like experience.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-dark-400 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleInstall}
            className="flex-1 bg-amber hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-dark-300 hover:text-white transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
