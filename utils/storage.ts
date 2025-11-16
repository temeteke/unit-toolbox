// LocalStorage関連の型定義とユーティリティ関数

export interface ConversionHistory {
  id: string;
  timestamp: number;
  categoryId: string;
  categoryName: string;
  inputValue: string;
  fromUnitId: string;
  fromUnitName: string;
  toUnitId: string;
  toUnitName: string;
  result: number;
}

export interface FavoriteUnit {
  id: string;
  categoryId: string;
  fromUnitId: string;
  toUnitId: string;
  label: string;
}

const HISTORY_KEY = 'unit-toolbox-history';
const FAVORITES_KEY = 'unit-toolbox-favorites';
const MAX_HISTORY_ITEMS = 50;

// 履歴の取得
export function getHistory(): ConversionHistory[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

// 履歴の保存
export function saveHistory(item: Omit<ConversionHistory, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getHistory();
    const newItem: ConversionHistory = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    // 新しいアイテムを先頭に追加
    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

// 履歴のクリア
export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

// お気に入りの取得
export function getFavorites(): FavoriteUnit[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load favorites:', error);
    return [];
  }
}

// お気に入りの保存
export function saveFavorite(favorite: Omit<FavoriteUnit, 'id'>): void {
  if (typeof window === 'undefined') return;
  try {
    const favorites = getFavorites();
    const newFavorite: FavoriteUnit = {
      ...favorite,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };

    const updatedFavorites = [...favorites, newFavorite];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Failed to save favorite:', error);
  }
}

// お気に入りの削除
export function removeFavorite(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(f => f.id !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Failed to remove favorite:', error);
  }
}

// お気に入りのクリア
export function clearFavorites(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Failed to clear favorites:', error);
  }
}

// エクスポート/インポート用の型定義
export interface ExportData {
  version: string;
  exportDate: string;
  history: ConversionHistory[];
  favorites: FavoriteUnit[];
}

// データのエクスポート
export function exportData(): ExportData {
  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    history: getHistory(),
    favorites: getFavorites(),
  };
}

// データのインポート
export function importData(data: ExportData): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Window is not available' };
  }

  try {
    // データの検証
    if (!data.version || !data.history || !data.favorites) {
      return { success: false, error: 'Invalid data format' };
    }

    // 履歴とお気に入りをインポート
    localStorage.setItem(HISTORY_KEY, JSON.stringify(data.history));
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(data.favorites));

    return { success: true };
  } catch (error) {
    console.error('Failed to import data:', error);
    return { success: false, error: 'Failed to import data' };
  }
}

// JSONファイルとしてダウンロード
export function downloadAsJSON(data: ExportData, filename: string = 'unit-toolbox-data.json'): void {
  if (typeof window === 'undefined') return;

  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download JSON:', error);
  }
}
