'use client';

import { useState, useEffect, useMemo } from 'react';
import { categories, convert, Unit, UnitCategory } from '@/utils/conversions';

export default function UnitConverter() {
  // 基本的な状態
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>(
    categories[0]
  );
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<Unit>(categories[0].units[0]);
  const [toUnit, setToUnit] = useState<Unit>(categories[0].units[1]);

  // 新機能の状態
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // オフライン状態の検出
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showOfflineNotice, setShowOfflineNotice] = useState<boolean>(false);

  // 新機能の状態
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);

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

  // オフライン状態の監視
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineNotice(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineNotice(true);
    };

    // 初期状態を設定
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // URLパラメータから状態を復元
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const categoryId = params.get('category');
      const fromUnitId = params.get('from');
      const toUnitId = params.get('to');
      const value = params.get('value');

      if (categoryId) {
        const category = categories.find(c => c.id === categoryId);
        if (category) {
          setSelectedCategory(category);
          if (fromUnitId) {
            const unit = category.units.find(u => u.id === fromUnitId);
            if (unit) setFromUnit(unit);
          }
          if (toUnitId) {
            const unit = category.units.find(u => u.id === toUnitId);
            if (unit) setToUnit(unit);
          }
        }
      }
      if (value) {
        setInputValue(value);
      }
    }
  }, []);

  // キーボードショートカット
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: カテゴリ選択にフォーカス
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('category')?.focus();
      }
      // ?: ショートカットヘルプ表示
      else if (e.shiftKey && e.key === '?' && !(e.target as HTMLElement).matches('input, textarea')) {
        e.preventDefault();
        setShowKeyboardHelp(prev => !prev);
      }
      // Esc: モーダル/パネルを閉じる
      else if (e.key === 'Escape') {
        setShowKeyboardHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setSelectedCategory(category);
      setFromUnit(category.units[0]);
      setToUnit(category.units[1] || category.units[0]);
    }
  };

  const handleFromUnitChange = (unitId: string) => {
    const unit = selectedCategory.units.find((u) => u.id === unitId);
    if (unit) {
      setFromUnit(unit);
    }
  };

  const handleToUnitChange = (unitId: string) => {
    const unit = selectedCategory.units.find((u) => u.id === unitId);
    if (unit) {
      setToUnit(unit);
    }
  };

  const numericValue = parseFloat(inputValue);
  const result =
    !isNaN(numericValue) && isFinite(numericValue)
      ? convert(numericValue, fromUnit, toUnit)
      : 0;

  const handleCopyResult = () => {
    const text = `${numericValue} ${fromUnit.name} = ${result.toLocaleString('ja-JP', {
      maximumFractionDigits: 10,
    })} ${toUnit.name}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('コピーしました！');
    });
  };

  const handleShareURL = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('category', selectedCategory.id);
    url.searchParams.set('from', fromUnit.id);
    url.searchParams.set('to', toUnit.id);
    url.searchParams.set('value', inputValue);

    navigator.clipboard.writeText(url.toString()).then(() => {
      alert('URLをコピーしました！');
    });
  };

  // スタイル定義
  const colors = {
    bg: darkMode ? '#1a1a1a' : '#ffffff',
    bgSecondary: darkMode ? '#2a2a2a' : '#f9fafb',
    bgTertiary: darkMode ? '#3a3a3a' : '#f0f9ff',
    border: darkMode ? '#4a4a4a' : '#e5e7eb',
    borderAccent: darkMode ? '#0ea5e9' : '#0ea5e9',
    text: darkMode ? '#e5e7eb' : '#111827',
    textSecondary: darkMode ? '#9ca3af' : '#6b7280',
    textAccent: darkMode ? '#38bdf8' : '#0369a1',
    textAccentStrong: darkMode ? '#e0f2fe' : '#0c4a6e',
    button: darkMode ? '#3b82f6' : '#0ea5e9',
    buttonHover: darkMode ? '#2563eb' : '#0284c7',
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: colors.bg, color: colors.text, minHeight: '100vh', padding: '0.5rem' }}>
      {/* オフライン通知バナー */}
      {showOfflineNotice && !isOnline && (
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: '#f59e0b',
          color: '#ffffff',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📡</span>
            <div>
              <div style={{ fontWeight: 'bold' }}>
                オフライン モード
              </div>
              <div style={{ fontSize: '0.875rem' }}>
                インターネットに接続されていませんが、アプリは引き続き使用できます。
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowOfflineNotice(false)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0 0.5rem',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* オンライン復帰通知 */}
      {isOnline && showOfflineNotice && (
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: '#10b981',
          color: '#ffffff',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>✓</span>
            <div>
              <div style={{ fontWeight: 'bold' }}>
                オンラインに復帰しました
              </div>
              <div style={{ fontSize: '0.875rem' }}>
                インターネット接続が復元されました。
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowOfflineNotice(false)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0 0.5rem',
            }}
          >
            ×
          </button>
        </div>
      )}


      {/* キーボードショートカットヘルプ */}
      {showKeyboardHelp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '1rem',
        }}
        onClick={() => setShowKeyboardHelp(false)}
        >
          <div
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              border: `2px solid ${colors.borderAccent}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              キーボードショートカット
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {[
                { keys: 'Ctrl/Cmd + K', desc: 'カテゴリ選択にフォーカス' },
                { keys: '?', desc: 'このヘルプを表示' },
                { keys: 'Esc', desc: 'モーダルを閉じる' },
              ].map((shortcut, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: colors.bgSecondary,
                    borderRadius: '4px',
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {shortcut.keys}
                  </span>
                  <span style={{ color: colors.textSecondary }}>
                    {shortcut.desc}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowKeyboardHelp(false)}
              style={{
                marginTop: '1.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: colors.button,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* カテゴリ選択 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="category"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          カテゴリを選択:
        </label>
        <select
          id="category"
          value={selectedCategory.id}
          onChange={(e) => handleCategoryChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.bg,
            color: colors.text,
          }}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* 単位選択：変換元 → 変換先 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          変換する単位を選択:
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* 変換元の単位 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: colors.textSecondary, fontWeight: 'bold' }}>
              変換元
            </div>
            <select
              value={fromUnit.id}
              onChange={(e) => handleFromUnitChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '1rem',
                borderRadius: '4px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.bg,
                color: colors.text,
              }}
            >
              {selectedCategory.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          {/* 変換先の単位 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: colors.textSecondary, fontWeight: 'bold' }}>
              変換先
            </div>
            <select
              value={toUnit.id}
              onChange={(e) => handleToUnitChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '1rem',
                borderRadius: '4px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.bg,
                color: colors.text,
              }}
            >
              {selectedCategory.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 数値入力 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="input-value"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          数値を入力:
        </label>
        <input
          id="input-value"
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: `2px solid ${colors.borderAccent}`,
            backgroundColor: colors.bg,
            color: colors.text,
            boxSizing: 'border-box',
          }}
          placeholder="例: 100"
        />
      </div>

      {/* 結果 */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: colors.bgTertiary,
          borderRadius: '8px',
          border: `2px solid ${colors.borderAccent}`,
          marginBottom: '1rem',
        }}
      >
        <div style={{ fontSize: '0.875rem', color: colors.textAccent, marginBottom: '0.5rem' }}>
          変換結果:
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.textAccentStrong }}>
          {result.toLocaleString('ja-JP', {
            maximumFractionDigits: 10,
          })}{' '}
          <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>
            {toUnit.name}
          </span>
        </div>
      </div>

      {/* アクションボタン */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleCopyResult}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: colors.button,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            コピー
          </button>
          <button
            onClick={handleShareURL}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: colors.button,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            共有
          </button>
        </div>
        <button
          onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: colors.bgSecondary,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
          title="キーボードショートカット (?)"
        >
          ?
        </button>
      </div>

      {/* すべての単位への変換結果を表示 */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 'bold' }}>
          他の単位への変換:
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {selectedCategory.units
            .filter((unit) => unit.id !== toUnit.id)
            .map((unit) => {
              const convertedValue =
                !isNaN(numericValue) && isFinite(numericValue)
                  ? convert(numericValue, fromUnit, unit)
                  : 0;
              return (
                <div
                  key={unit.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: colors.bgSecondary,
                    borderRadius: '4px',
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.25rem' }}>
                    {unit.name}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: colors.text }}>
                    {convertedValue.toLocaleString('ja-JP', {
                      maximumFractionDigits: 6,
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
