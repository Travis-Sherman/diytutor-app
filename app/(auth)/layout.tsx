import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-heading font-bold">
              DIY<span className="text-amber">Tutor</span>
            </h1>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
