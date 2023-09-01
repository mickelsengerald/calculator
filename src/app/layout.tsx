import type { Metadata } from 'next'
import Providers from '@/redux/providers'

export const metadata: Metadata = {
  title: 'Calculator',
  description: 'Tech Test',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  )
}
