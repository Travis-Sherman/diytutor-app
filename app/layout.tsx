import type { Metadata, Viewport } from "next"
import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"
import { Toaster } from "react-hot-toast"
import InstallPrompt from "@/components/ui/InstallPrompt"

export const metadata: Metadata = {
  title: "DIYTutor - From Idea to Done",
  description: "AI-powered step-by-step project instructions. Get clear, detailed guides for any DIY project you want to build.",
  keywords: ["DIY", "projects", "instructions", "how-to", "maker", "AI"],
  manifest: "/manifest.json",
  themeColor: "#f59e0b",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DIYTutor",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f59e0b",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <InstallPrompt />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#18181b',
                color: '#fff',
                border: '1px solid #27272a',
              },
              success: {
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#000',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
