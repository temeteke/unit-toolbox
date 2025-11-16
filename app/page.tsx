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

        <footer style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>対応カテゴリ</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
              ✓ 長さ
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
              ✓ 面積
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
              ✓ 体積
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
              ✓ 質量
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
              ✓ 温度
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
              ✓ 速度
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
              ✓ データ量
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
              ✓ エネルギー
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
              ✓ 圧力
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
