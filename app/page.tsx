'use client';

import { useState, useEffect } from 'react';
import UnitConverter from '@/components/UnitConverter';

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // ダークモード初期化（システム設定を検出）
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 初期設定
    setDarkMode(mediaQuery.matches);

    // システム設定の変更を検出
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };

    // イベントリスナーを追加
    mediaQuery.addEventListener('change', handleChange);

    // クリーンアップ
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const colors = {
    bg: darkMode ? '#1a1a1a' : '#ffffff',
    text: darkMode ? '#e5e7eb' : '#111827',
    textSecondary: darkMode ? '#9ca3af' : '#6b7280',
  };

  return (
    <main style={{
      padding: '2rem',
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      backgroundColor: colors.bg,
      color: colors.text,
      transition: 'background-color 0.3s, color 0.3s',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: colors.text }}>
            Unit Toolbox - 単位変換ツール
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: '1rem' }}>
            異なる単位系（SI、ヤード・ポンド、日本の伝統単位など）をまとめて扱う単位変換ツールです。
          </p>
        </header>

        <section style={{ marginBottom: '2rem' }}>
          <UnitConverter />
        </section>
      </div>
    </main>
  );
}
