import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unit Toolbox - 単位変換ツール',
  description: '異なる単位系（SI、ヤード・ポンド、日本の伝統単位など）をまとめて扱う単位変換ツール',
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
