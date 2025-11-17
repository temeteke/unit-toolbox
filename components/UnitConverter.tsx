'use client';

import { useState, useEffect, useMemo } from 'react';
import { categories, convert, Unit, UnitCategory } from '@/utils/conversions';
import {
  getHistory,
  saveHistory,
  clearHistory,
  getFavorites,
  saveFavorite,
  removeFavorite,
  ConversionHistory,
  FavoriteUnit,
  exportData,
  importData,
  downloadAsJSON,
  ExportData,
} from '@/utils/storage';

export default function UnitConverter() {
  // 基本的な状態
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>(
    categories[0]
  );
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<Unit>(categories[0].units[0]);
  const [toUnit, setToUnit] = useState<Unit>(categories[0].units[1]);

  // 新機能の状態
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [favorites, setFavorites] = useState<FavoriteUnit[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  // 多言語対応
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');

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

  // 履歴とお気に入りの読み込み
  useEffect(() => {
    setHistory(getHistory());
    setFavorites(getFavorites());
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
      // Ctrl/Cmd + H: 履歴表示切替
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setShowHistory(prev => !prev);
      }
      // Ctrl/Cmd + F: お気に入り表示切替（ブラウザの検索と競合しないように）
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setShowFavorites(prev => !prev);
      }
      // Ctrl/Cmd + K: カテゴリ選択にフォーカス
      else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('category')?.focus();
      }
      // Ctrl/Cmd + E: エクスポート
      else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        const data = exportData();
        downloadAsJSON(data, `unit-toolbox-backup-${new Date().toISOString().split('T')[0]}.json`);
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

  const t = (key: string): string => {
    const translations: Record<string, Record<'ja' | 'en', string>> = {
      category: { ja: 'カテゴリを選択', en: 'Select Category' },
      from: { ja: '変換元', en: 'From' },
      to: { ja: '変換先', en: 'To' },
      result: { ja: '変換結果', en: 'Result' },
      otherUnits: { ja: '他の単位への変換', en: 'Other Conversions' },
      history: { ja: '履歴', en: 'History' },
      favorites: { ja: 'お気に入り', en: 'Favorites' },
      clearHistory: { ja: '履歴をクリア', en: 'Clear History' },
      addFavorite: { ja: 'お気に入りに追加', en: 'Add to Favorites' },
      copy: { ja: 'コピー', en: 'Copy' },
      share: { ja: '共有', en: 'Share' },
      export: { ja: 'エクスポート', en: 'Export' },
      import: { ja: 'インポート', en: 'Import' },
      keyboardHelp: { ja: 'キーボードショートカット', en: 'Keyboard Shortcuts' },
    };
    return translations[key]?.[language] || key;
  };

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

  // 変換が実行されたら履歴に保存
  useEffect(() => {
    if (!isNaN(numericValue) && isFinite(numericValue) && numericValue !== 0) {
      const timer = setTimeout(() => {
        saveHistory({
          categoryId: selectedCategory.id,
          categoryName: selectedCategory.name,
          inputValue,
          fromUnitId: fromUnit.id,
          fromUnitName: fromUnit.name,
          toUnitId: toUnit.id,
          toUnitName: toUnit.name,
          result,
        });
        setHistory(getHistory());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [numericValue, fromUnit, toUnit, result, selectedCategory, inputValue]);

  const handleCopyResult = () => {
    const text = `${numericValue} ${fromUnit.name} = ${result.toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US', {
      maximumFractionDigits: 10,
    })} ${toUnit.name}`;
    navigator.clipboard.writeText(text).then(() => {
      alert(language === 'ja' ? 'コピーしました！' : 'Copied!');
    });
  };

  const handleShareURL = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('category', selectedCategory.id);
    url.searchParams.set('from', fromUnit.id);
    url.searchParams.set('to', toUnit.id);
    url.searchParams.set('value', inputValue);

    navigator.clipboard.writeText(url.toString()).then(() => {
      alert(language === 'ja' ? 'URLをコピーしました！' : 'URL copied!');
    });
  };

  const handleAddFavorite = () => {
    const label = `${fromUnit.name} → ${toUnit.name}`;
    saveFavorite({
      categoryId: selectedCategory.id,
      fromUnitId: fromUnit.id,
      toUnitId: toUnit.id,
      label,
    });
    setFavorites(getFavorites());
    alert(language === 'ja' ? 'お気に入りに追加しました！' : 'Added to favorites!');
  };

  const handleLoadFavorite = (fav: FavoriteUnit) => {
    const category = categories.find(c => c.id === fav.categoryId);
    if (category) {
      setSelectedCategory(category);
      const from = category.units.find(u => u.id === fav.fromUnitId);
      const to = category.units.find(u => u.id === fav.toUnitId);
      if (from) setFromUnit(from);
      if (to) setToUnit(to);
    }
  };

  const handleLoadHistory = (item: ConversionHistory) => {
    const category = categories.find(c => c.id === item.categoryId);
    if (category) {
      setSelectedCategory(category);
      const from = category.units.find(u => u.id === item.fromUnitId);
      const to = category.units.find(u => u.id === item.toUnitId);
      if (from) setFromUnit(from);
      if (to) setToUnit(to);
      setInputValue(item.inputValue);
    }
  };

  // エクスポート機能
  const handleExport = () => {
    const data = exportData();
    downloadAsJSON(data, `unit-toolbox-backup-${new Date().toISOString().split('T')[0]}.json`);
    alert(language === 'ja' ? 'データをエクスポートしました！' : 'Data exported!');
  };

  // インポート機能
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string) as ExportData;
          const result = importData(data);

          if (result.success) {
            setHistory(getHistory());
            setFavorites(getFavorites());
            alert(language === 'ja' ? 'データをインポートしました！' : 'Data imported!');
          } else {
            alert(language === 'ja' ?
              `インポートに失敗しました: ${result.error}` :
              `Import failed: ${result.error}`);
          }
        } catch (error) {
          alert(language === 'ja' ?
            'ファイルの読み込みに失敗しました' :
            'Failed to read file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: colors.bg, color: colors.text, minHeight: '100vh', padding: '1rem' }}>
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
                {language === 'ja' ? 'オフライン モード' : 'Offline Mode'}
              </div>
              <div style={{ fontSize: '0.875rem' }}>
                {language === 'ja'
                  ? 'インターネットに接続されていませんが、アプリは引き続き使用できます。'
                  : 'You are offline, but the app will continue to work.'}
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
                {language === 'ja' ? 'オンラインに復帰しました' : 'Back Online'}
              </div>
              <div style={{ fontSize: '0.875rem' }}>
                {language === 'ja'
                  ? 'インターネット接続が復元されました。'
                  : 'Your internet connection has been restored.'}
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

      {/* ヘッダーコントロール */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowHistory(!showHistory)}
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
            {t('history')}
          </button>
          <button
            onClick={() => setShowFavorites(!showFavorites)}
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
            {t('favorites')}
          </button>
          <button
            onClick={handleExport}
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
            {t('export')}
          </button>
          <button
            onClick={handleImport}
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
            {t('import')}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: colors.bgSecondary,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
            title={language === 'ja' ? 'キーボードショートカット (?)' : 'Keyboard Shortcuts (?)'}
          >
            ?
          </button>
          <button
            onClick={() => setLanguage(language === 'ja' ? 'en' : 'ja')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: colors.bgSecondary,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            {language === 'ja' ? 'EN' : 'JA'}
          </button>
        </div>
      </div>

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
              {t('keyboardHelp')}
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {[
                { keys: language === 'ja' ? 'Ctrl/Cmd + H' : 'Ctrl/Cmd + H', desc: language === 'ja' ? '履歴表示切替' : 'Toggle history' },
                { keys: language === 'ja' ? 'Ctrl/Cmd + Shift + F' : 'Ctrl/Cmd + Shift + F', desc: language === 'ja' ? 'お気に入り表示切替' : 'Toggle favorites' },
                { keys: language === 'ja' ? 'Ctrl/Cmd + K' : 'Ctrl/Cmd + K', desc: language === 'ja' ? 'カテゴリ選択にフォーカス' : 'Focus on category' },
                { keys: language === 'ja' ? 'Ctrl/Cmd + E' : 'Ctrl/Cmd + E', desc: language === 'ja' ? 'データをエクスポート' : 'Export data' },
                { keys: '?', desc: language === 'ja' ? 'このヘルプを表示' : 'Show this help' },
                { keys: 'Esc', desc: language === 'ja' ? 'モーダル/パネルを閉じる' : 'Close modals/panels' },
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
              {language === 'ja' ? '閉じる' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* 履歴表示 */}
      {showHistory && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: colors.bgSecondary,
          borderRadius: '8px',
          border: `1px solid ${colors.border}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', margin: 0 }}>{t('history')}</h3>
            <button
              onClick={() => {
                clearHistory();
                setHistory([]);
              }}
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.75rem',
              }}
            >
              {t('clearHistory')}
            </button>
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {history.length === 0 ? (
              <p style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>
                {language === 'ja' ? '履歴がありません' : 'No history'}
              </p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleLoadHistory(item)}
                  style={{
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    backgroundColor: colors.bg,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: `1px solid ${colors.border}`,
                    fontSize: '0.875rem',
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: colors.textAccent }}>
                    {item.categoryName}
                  </div>
                  <div>
                    {item.inputValue} {item.fromUnitName} → {item.result.toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US', { maximumFractionDigits: 6 })} {item.toUnitName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>
                    {new Date(item.timestamp).toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* お気に入り表示 */}
      {showFavorites && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: colors.bgSecondary,
          borderRadius: '8px',
          border: `1px solid ${colors.border}`,
        }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>{t('favorites')}</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {favorites.length === 0 ? (
              <p style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>
                {language === 'ja' ? 'お気に入りがありません' : 'No favorites'}
              </p>
            ) : (
              favorites.map((fav) => (
                <div
                  key={fav.id}
                  style={{
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    backgroundColor: colors.bg,
                    borderRadius: '4px',
                    border: `1px solid ${colors.border}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    onClick={() => handleLoadFavorite(fav)}
                    style={{ cursor: 'pointer', flex: 1, fontSize: '0.875rem' }}
                  >
                    {fav.label}
                  </div>
                  <button
                    onClick={() => {
                      removeFavorite(fav.id);
                      setFavorites(getFavorites());
                    }}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
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
          {t('category')}:
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
          {language === 'ja' ? '変換する単位を選択' : 'Select Units'}:
        </label>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* 変換元の単位 */}
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: colors.textSecondary, fontWeight: 'bold' }}>
              {t('from')}
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

          {/* 矢印 */}
          <div style={{ fontSize: '1.5rem', color: colors.textAccent, marginTop: '1.25rem' }}>
            →
          </div>

          {/* 変換先の単位 */}
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: colors.textSecondary, fontWeight: 'bold' }}>
              {t('to')}
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
          {language === 'ja' ? '数値を入力' : 'Enter Value'}:
        </label>
        <input
          id="input-value"
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1.25rem',
            borderRadius: '4px',
            border: `2px solid ${colors.borderAccent}`,
            backgroundColor: colors.bg,
            color: colors.text,
          }}
          placeholder={language === 'ja' ? '例: 100' : 'e.g. 100'}
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
          {t('result')}:
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.textAccentStrong }}>
          {result.toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US', {
            maximumFractionDigits: 10,
          })}{' '}
          <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>
            {toUnit.name}
          </span>
        </div>
      </div>

      {/* アクションボタン */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
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
          {t('copy')}
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
          {t('share')}
        </button>
        <button
          onClick={handleAddFavorite}
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
          ★ {t('addFavorite')}
        </button>
      </div>

      {/* すべての単位への変換結果を表示 */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 'bold' }}>
          {t('otherUnits')}:
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
                    {convertedValue.toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US', {
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
