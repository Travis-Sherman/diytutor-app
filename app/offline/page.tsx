export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-amber rounded-full flex items-center justify-center text-black font-bold text-4xl mx-auto mb-6">
          D
        </div>

        <h1 className="text-2xl font-heading font-bold text-white mb-4">
          You&apos;re Offline
        </h1>

        <p className="text-dark-300 mb-6">
          No internet connection detected. Don&apos;t worry - your saved projects are still available.
        </p>

        <a
          href="/dashboard"
          className="btn-primary inline-block"
        >
          View Your Projects
        </a>
      </div>
    </div>
  )
}
