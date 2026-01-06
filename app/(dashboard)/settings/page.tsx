'use client'

import { useAuth } from '@/hooks/useAuth'
import { Crown, User, CreditCard, Shield } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Settings</h1>
        <p className="text-dark-300">
          Manage your account and subscription
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Account Information */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <User size={24} className="text-amber" />
            <h2 className="text-xl font-heading font-bold">Account Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={user?.displayName || ''}
                disabled
                className="input-field opacity-60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Crown size={24} className="text-amber" />
            <h2 className="text-xl font-heading font-bold">Subscription</h2>
          </div>

          {user?.plan === 'pro' ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="px-4 py-2 bg-gradient-to-r from-amber to-yellow-500 text-black font-semibold rounded-lg">
                  Pro Plan
                </div>
              </div>
              <p className="text-dark-300 mb-6">
                You&apos;re currently on the Pro plan with unlimited projects and priority support.
              </p>
              <button className="btn-secondary">
                Manage Subscription
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="px-4 py-2 bg-dark-700 text-dark-300 rounded-lg">
                  Free Plan
                </div>
              </div>
              <p className="text-dark-300 mb-6">
                Upgrade to Pro for unlimited projects, follow-up questions, and priority support.
              </p>

              {/* Pricing Comparison */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-dark-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Free</h3>
                  <p className="text-2xl font-bold mb-4">$0<span className="text-sm text-dark-400">/month</span></p>
                  <ul className="space-y-2 text-sm text-dark-300">
                    <li>✓ 3 projects per month</li>
                    <li>✓ Basic instructions</li>
                    <li>✓ Community support</li>
                  </ul>
                </div>
                <div className="border-2 border-amber rounded-lg p-4 bg-dark-900">
                  <h3 className="font-semibold text-amber mb-2">Pro</h3>
                  <p className="text-2xl font-bold mb-4">$19<span className="text-sm text-dark-400">/month</span></p>
                  <ul className="space-y-2 text-sm text-dark-300">
                    <li>✓ 50 projects per month</li>
                    <li>✓ Detailed instructions</li>
                    <li>✓ Follow-up questions</li>
                    <li>✓ Priority support</li>
                    <li>✓ Export to PDF</li>
                  </ul>
                </div>
              </div>

              <button className="btn-primary">
                Upgrade to Pro
              </button>
            </div>
          )}
        </div>

        {/* Billing */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard size={24} className="text-amber" />
            <h2 className="text-xl font-heading font-bold">Billing</h2>
          </div>
          <p className="text-dark-300 mb-4">
            {user?.plan === 'pro'
              ? 'Manage your payment methods and billing history.'
              : 'No billing information on file.'}
          </p>
          {user?.plan === 'pro' && (
            <button className="btn-secondary">
              View Billing History
            </button>
          )}
        </div>

        {/* Privacy & Security */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={24} className="text-amber" />
            <h2 className="text-xl font-heading font-bold">Privacy & Security</h2>
          </div>
          <div className="space-y-4">
            <button className="btn-secondary">
              Change Password
            </button>
            <div className="pt-4 border-t border-dark-700">
              <button className="text-red-500 hover:text-red-400 text-sm font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
