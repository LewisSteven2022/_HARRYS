import '@/styles/globals.css'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "Harry's - Personal Training & Functional Fitness",
  description:
    'Premium personal training and functional fitness in Jersey. Transform your body and mind with expert coaching.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="bg-[#0a0a0a] text-gray-300 font-sans">
        <Navigation />
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
