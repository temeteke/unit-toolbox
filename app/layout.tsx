import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Unit Toolbox - 単位変換ツール',
  description: '異なる単位系（SI、ヤード・ポンド、日本の伝統単位など）をまとめて扱う単位変換ツール',
  manifest: '/unit-toolbox/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Unit Toolbox',
  },
  icons: {
    icon: [
      { url: '/unit-toolbox/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/unit-toolbox/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/unit-toolbox/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
