import UnitConverter from '@/components/UnitConverter';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            Unit Toolbox - 単位変換ツール
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
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
