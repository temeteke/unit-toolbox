'use client';

import { useState } from 'react';
import { categories, convert, Unit, UnitCategory } from '@/utils/conversions';

export default function UnitConverter() {
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>(
    categories[0]
  );
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<Unit>(categories[0].units[0]);
  const [toUnit, setToUnit] = useState<Unit>(categories[0].units[1]);

  // カテゴリが変更されたら単位をリセット
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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* カテゴリ選択 */}
      <div style={{ marginBottom: '2rem' }}>
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
            border: '1px solid #ccc',
          }}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* 変換元 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="input-value"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          変換元:
        </label>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            id="input-value"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <select
            value={fromUnit.id}
            onChange={(e) => handleFromUnitChange(e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
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

      {/* 変換先 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="to-unit"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          変換先:
        </label>
        <select
          id="to-unit"
          value={toUnit.id}
          onChange={(e) => handleToUnitChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          {selectedCategory.units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name}
            </option>
          ))}
        </select>
      </div>

      {/* 結果 */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          border: '2px solid #0ea5e9',
        }}
      >
        <div style={{ fontSize: '0.875rem', color: '#0369a1', marginBottom: '0.5rem' }}>
          変換結果:
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0c4a6e' }}>
          {result.toLocaleString('ja-JP', {
            maximumFractionDigits: 10,
          })}{' '}
          <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>
            {toUnit.name}
          </span>
        </div>
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
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {unit.name}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
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
