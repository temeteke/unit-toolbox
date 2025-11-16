// 単位変換のための型定義
export interface Unit {
  id: string;
  name: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export interface UnitCategory {
  id: string;
  name: string;
  units: Unit[];
}

// 長さの単位
const lengthUnits: Unit[] = [
  {
    id: 'meter',
    name: 'メートル (m)',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'kilometer',
    name: 'キロメートル (km)',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: 'centimeter',
    name: 'センチメートル (cm)',
    toBase: (v) => v / 100,
    fromBase: (v) => v * 100,
  },
  {
    id: 'millimeter',
    name: 'ミリメートル (mm)',
    toBase: (v) => v / 1000,
    fromBase: (v) => v * 1000,
  },
  {
    id: 'mile',
    name: 'マイル (mi)',
    toBase: (v) => v * 1609.344,
    fromBase: (v) => v / 1609.344,
  },
  {
    id: 'yard',
    name: 'ヤード (yd)',
    toBase: (v) => v * 0.9144,
    fromBase: (v) => v / 0.9144,
  },
  {
    id: 'foot',
    name: 'フィート (ft)',
    toBase: (v) => v * 0.3048,
    fromBase: (v) => v / 0.3048,
  },
  {
    id: 'inch',
    name: 'インチ (in)',
    toBase: (v) => v * 0.0254,
    fromBase: (v) => v / 0.0254,
  },
  {
    id: 'shaku',
    name: '尺',
    toBase: (v) => v * 0.303030303,
    fromBase: (v) => v / 0.303030303,
  },
  {
    id: 'sun',
    name: '寸',
    toBase: (v) => v * 0.0303030303,
    fromBase: (v) => v / 0.0303030303,
  },
];

// 面積の単位
const areaUnits: Unit[] = [
  {
    id: 'square_meter',
    name: '平方メートル (m²)',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'square_kilometer',
    name: '平方キロメートル (km²)',
    toBase: (v) => v * 1000000,
    fromBase: (v) => v / 1000000,
  },
  {
    id: 'square_centimeter',
    name: '平方センチメートル (cm²)',
    toBase: (v) => v / 10000,
    fromBase: (v) => v * 10000,
  },
  {
    id: 'hectare',
    name: 'ヘクタール (ha)',
    toBase: (v) => v * 10000,
    fromBase: (v) => v / 10000,
  },
  {
    id: 'acre',
    name: 'エーカー',
    toBase: (v) => v * 4046.8564224,
    fromBase: (v) => v / 4046.8564224,
  },
  {
    id: 'tsubo',
    name: '坪',
    toBase: (v) => v * 3.30578512,
    fromBase: (v) => v / 3.30578512,
  },
];

// 体積の単位
const volumeUnits: Unit[] = [
  {
    id: 'cubic_meter',
    name: '立方メートル (m³)',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'liter',
    name: 'リットル (L)',
    toBase: (v) => v / 1000,
    fromBase: (v) => v * 1000,
  },
  {
    id: 'milliliter',
    name: 'ミリリットル (mL)',
    toBase: (v) => v / 1000000,
    fromBase: (v) => v * 1000000,
  },
  {
    id: 'gallon',
    name: 'ガロン (gal)',
    toBase: (v) => v * 0.00378541,
    fromBase: (v) => v / 0.00378541,
  },
  {
    id: 'quart',
    name: 'クォート (qt)',
    toBase: (v) => v * 0.000946353,
    fromBase: (v) => v / 0.000946353,
  },
  {
    id: 'pint',
    name: 'パイント (pt)',
    toBase: (v) => v * 0.000473176,
    fromBase: (v) => v / 0.000473176,
  },
  {
    id: 'cup',
    name: 'カップ',
    toBase: (v) => v * 0.0002365882,
    fromBase: (v) => v / 0.0002365882,
  },
  {
    id: 'go',
    name: '合',
    toBase: (v) => v * 0.00018039,
    fromBase: (v) => v / 0.00018039,
  },
  {
    id: 'sho',
    name: '升',
    toBase: (v) => v * 0.0018039,
    fromBase: (v) => v / 0.0018039,
  },
];

// 質量の単位
const massUnits: Unit[] = [
  {
    id: 'kilogram',
    name: 'キログラム (kg)',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'gram',
    name: 'グラム (g)',
    toBase: (v) => v / 1000,
    fromBase: (v) => v * 1000,
  },
  {
    id: 'milligram',
    name: 'ミリグラム (mg)',
    toBase: (v) => v / 1000000,
    fromBase: (v) => v * 1000000,
  },
  {
    id: 'ton',
    name: 'トン (t)',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: 'pound',
    name: 'ポンド (lb)',
    toBase: (v) => v * 0.45359237,
    fromBase: (v) => v / 0.45359237,
  },
  {
    id: 'ounce',
    name: 'オンス (oz)',
    toBase: (v) => v * 0.028349523125,
    fromBase: (v) => v / 0.028349523125,
  },
  {
    id: 'kan',
    name: '貫',
    toBase: (v) => v * 3.75,
    fromBase: (v) => v / 3.75,
  },
  {
    id: 'kin',
    name: '斤',
    toBase: (v) => v * 0.6,
    fromBase: (v) => v / 0.6,
  },
];

// 温度の単位（特殊な変換が必要）
const temperatureUnits: Unit[] = [
  {
    id: 'celsius',
    name: '摂氏 (°C)',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'fahrenheit',
    name: '華氏 (°F)',
    toBase: (v) => (v - 32) * (5 / 9),
    fromBase: (v) => v * (9 / 5) + 32,
  },
  {
    id: 'kelvin',
    name: 'ケルビン (K)',
    toBase: (v) => v - 273.15,
    fromBase: (v) => v + 273.15,
  },
];

// 速度の単位
const speedUnits: Unit[] = [
  {
    id: 'meter_per_second',
    name: 'メートル毎秒 (m/s)',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'kilometer_per_hour',
    name: 'キロメートル毎時 (km/h)',
    toBase: (v) => v / 3.6,
    fromBase: (v) => v * 3.6,
  },
  {
    id: 'mile_per_hour',
    name: 'マイル毎時 (mph)',
    toBase: (v) => v * 0.44704,
    fromBase: (v) => v / 0.44704,
  },
  {
    id: 'knot',
    name: 'ノット (kn)',
    toBase: (v) => v * 0.514444,
    fromBase: (v) => v / 0.514444,
  },
];

// データ量の単位
const dataUnits: Unit[] = [
  {
    id: 'byte',
    name: 'バイト (B)',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'kilobyte',
    name: 'キロバイト (KB)',
    toBase: (v) => v * 1024,
    fromBase: (v) => v / 1024,
  },
  {
    id: 'megabyte',
    name: 'メガバイト (MB)',
    toBase: (v) => v * 1024 * 1024,
    fromBase: (v) => v / (1024 * 1024),
  },
  {
    id: 'gigabyte',
    name: 'ギガバイト (GB)',
    toBase: (v) => v * 1024 * 1024 * 1024,
    fromBase: (v) => v / (1024 * 1024 * 1024),
  },
  {
    id: 'terabyte',
    name: 'テラバイト (TB)',
    toBase: (v) => v * 1024 * 1024 * 1024 * 1024,
    fromBase: (v) => v / (1024 * 1024 * 1024 * 1024),
  },
  {
    id: 'bit',
    name: 'ビット (bit)',
    toBase: (v) => v / 8,
    fromBase: (v) => v * 8,
  },
];

// エネルギーの単位
const energyUnits: Unit[] = [
  {
    id: 'joule',
    name: 'ジュール (J)',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'kilojoule',
    name: 'キロジュール (kJ)',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: 'calorie',
    name: 'カロリー (cal)',
    toBase: (v) => v * 4.184,
    fromBase: (v) => v / 4.184,
  },
  {
    id: 'kilocalorie',
    name: 'キロカロリー (kcal)',
    toBase: (v) => v * 4184,
    fromBase: (v) => v / 4184,
  },
  {
    id: 'watt_hour',
    name: 'ワット時 (Wh)',
    toBase: (v) => v * 3600,
    fromBase: (v) => v / 3600,
  },
  {
    id: 'kilowatt_hour',
    name: 'キロワット時 (kWh)',
    toBase: (v) => v * 3600000,
    fromBase: (v) => v / 3600000,
  },
];

// 圧力の単位
const pressureUnits: Unit[] = [
  {
    id: 'pascal',
    name: 'パスカル (Pa)',
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: 'hectopascal',
    name: 'ヘクトパスカル (hPa)',
    toBase: (v) => v * 100,
    fromBase: (v) => v / 100,
  },
  {
    id: 'kilopascal',
    name: 'キロパスカル (kPa)',
    toBase: (v) => v * 1000,
    fromBase: (v) => v / 1000,
  },
  {
    id: 'bar',
    name: 'バール (bar)',
    toBase: (v) => v * 100000,
    fromBase: (v) => v / 100000,
  },
  {
    id: 'atmosphere',
    name: '気圧 (atm)',
    toBase: (v) => v * 101325,
    fromBase: (v) => v / 101325,
  },
  {
    id: 'mmHg',
    name: 'ミリメートル水銀柱 (mmHg)',
    toBase: (v) => v * 133.322,
    fromBase: (v) => v / 133.322,
  },
  {
    id: 'psi',
    name: 'ポンド毎平方インチ (psi)',
    toBase: (v) => v * 6894.757,
    fromBase: (v) => v / 6894.757,
  },
];

// すべてのカテゴリ
export const categories: UnitCategory[] = [
  {
    id: 'length',
    name: '長さ',
    units: lengthUnits,
  },
  {
    id: 'area',
    name: '面積',
    units: areaUnits,
  },
  {
    id: 'volume',
    name: '体積',
    units: volumeUnits,
  },
  {
    id: 'mass',
    name: '質量',
    units: massUnits,
  },
  {
    id: 'temperature',
    name: '温度',
    units: temperatureUnits,
  },
  {
    id: 'speed',
    name: '速度',
    units: speedUnits,
  },
  {
    id: 'data',
    name: 'データ量',
    units: dataUnits,
  },
  {
    id: 'energy',
    name: 'エネルギー',
    units: energyUnits,
  },
  {
    id: 'pressure',
    name: '圧力',
    units: pressureUnits,
  },
];

// 単位変換関数
export function convert(
  value: number,
  fromUnit: Unit,
  toUnit: Unit
): number {
  const baseValue = fromUnit.toBase(value);
  return toUnit.fromBase(baseValue);
}
