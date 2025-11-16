// 複合単位入力のパーサー
// 例: "1時間30分" → 90分, "1m 50cm" → 150cm

import { Unit } from './conversions';

interface ParsedCompound {
  value: number;
  unitId: string;
}

// 日本語の単位パターン
const jaPatterns = [
  { regex: /(\d+(?:\.\d+)?)\s*時間/g, unitId: 'hour' },
  { regex: /(\d+(?:\.\d+)?)\s*分/g, unitId: 'minute' },
  { regex: /(\d+(?:\.\d+)?)\s*秒/g, unitId: 'second' },
  { regex: /(\d+(?:\.\d+)?)\s*年/g, unitId: 'year' },
  { regex: /(\d+(?:\.\d+)?)\s*日/g, unitId: 'day' },
  { regex: /(\d+(?:\.\d+)?)\s*週/g, unitId: 'week' },
  { regex: /(\d+(?:\.\d+)?)\s*度/g, unitId: 'degree' },
  { regex: /(\d+(?:\.\d+)?)\s*メートル/g, unitId: 'meter' },
  { regex: /(\d+(?:\.\d+)?)\s*キロ(?:メートル)?/g, unitId: 'kilometer' },
  { regex: /(\d+(?:\.\d+)?)\s*センチ(?:メートル)?/g, unitId: 'centimeter' },
  { regex: /(\d+(?:\.\d+)?)\s*ミリ(?:メートル)?/g, unitId: 'millimeter' },
  { regex: /(\d+(?:\.\d+)?)\s*キロ(?:グラム)?/g, unitId: 'kilogram' },
  { regex: /(\d+(?:\.\d+)?)\s*グラム/g, unitId: 'gram' },
  { regex: /(\d+(?:\.\d+)?)\s*ポンド/g, unitId: 'pound' },
];

// 英語の単位パターン
const enPatterns = [
  { regex: /(\d+(?:\.\d+)?)\s*h(?:ours?)?/gi, unitId: 'hour' },
  { regex: /(\d+(?:\.\d+)?)\s*m(?:in(?:ute)?s?)?/gi, unitId: 'minute' },
  { regex: /(\d+(?:\.\d+)?)\s*s(?:ec(?:ond)?s?)?/gi, unitId: 'second' },
  { regex: /(\d+(?:\.\d+)?)\s*d(?:ays?)?/gi, unitId: 'day' },
  { regex: /(\d+(?:\.\d+)?)\s*y(?:ears?)?/gi, unitId: 'year' },
  { regex: /(\d+(?:\.\d+)?)\s*km/gi, unitId: 'kilometer' },
  { regex: /(\d+(?:\.\d+)?)\s*m/gi, unitId: 'meter' },
  { regex: /(\d+(?:\.\d+)?)\s*cm/gi, unitId: 'centimeter' },
  { regex: /(\d+(?:\.\d+)?)\s*mm/gi, unitId: 'millimeter' },
  { regex: /(\d+(?:\.\d+)?)\s*ft/gi, unitId: 'foot' },
  { regex: /(\d+(?:\.\d+)?)\s*in(?:ch(?:es)?)?/gi, unitId: 'inch' },
  { regex: /(\d+(?:\.\d+)?)\s*kg/gi, unitId: 'kilogram' },
  { regex: /(\d+(?:\.\d+)?)\s*g/gi, unitId: 'gram' },
  { regex: /(\d+(?:\.\d+)?)\s*lb/gi, unitId: 'pound' },
  { regex: /(\d+(?:\.\d+)?)\s*oz/gi, unitId: 'ounce' },
];

export function parseCompoundInput(
  input: string,
  availableUnits: Unit[]
): { success: boolean; totalValue?: number; baseUnitId?: string; error?: string } {
  if (!input.trim()) {
    return { success: false, error: 'Empty input' };
  }

  const patterns = [...jaPatterns, ...enPatterns];
  const parsedValues: ParsedCompound[] = [];

  // 各パターンにマッチする値を抽出
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.regex);
    let match;

    while ((match = regex.exec(input)) !== null) {
      const value = parseFloat(match[1]);
      if (!isNaN(value)) {
        parsedValues.push({ value, unitId: pattern.unitId });
      }
    }
  }

  if (parsedValues.length === 0) {
    return { success: false, error: 'No valid units found' };
  }

  // すべての値を基準単位に変換して合計
  let totalInBase = 0;
  let baseUnitId = '';

  for (const parsed of parsedValues) {
    const unit = availableUnits.find(u => u.id === parsed.unitId);
    if (unit) {
      totalInBase += unit.toBase(parsed.value);
      if (!baseUnitId) {
        baseUnitId = parsed.unitId;
      }
    }
  }

  if (baseUnitId && totalInBase !== 0) {
    return {
      success: true,
      totalValue: totalInBase,
      baseUnitId: availableUnits[0]?.id || baseUnitId, // 基準単位（カテゴリの最初の単位）を返す
    };
  }

  return { success: false, error: 'Failed to parse compound input' };
}

// 使用例用のヘルパー関数
export function getCompoundInputExamples(categoryId: string, language: 'ja' | 'en'): string[] {
  const examples: Record<string, Record<'ja' | 'en', string[]>> = {
    time: {
      ja: ['1時間30分', '2時間15分30秒', '3日12時間'],
      en: ['1h 30m', '2h 15m 30s', '3d 12h'],
    },
    length: {
      ja: ['1メートル50センチ', '2キロ500メートル'],
      en: ['1m 50cm', '5ft 10in'],
    },
    mass: {
      ja: ['1キロ500グラム', '2ポンド8オンス'],
      en: ['1kg 500g', '2lb 8oz'],
    },
    angle: {
      ja: ['45度30分', '90度15分30秒'],
      en: ['45° 30′', '90° 15′ 30″'],
    },
  };

  return examples[categoryId]?.[language] || [];
}
