import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Will you be my Valentine?',
  description: 'A special Valentine\'s Day proposal page',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}