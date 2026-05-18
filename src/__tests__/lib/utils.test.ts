import {
  formatCurrency,
  formatPercent,
  formatCompactCurrency,
  formatVolume,
  formatDate,
  formatDateTime,
  getTradeGain,
  getTradeGainValue,
  getConvictionLabel,
  getConvictionColor,
  getDaysSince,
  cn,
} from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats positive values', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats negative values', () => {
    expect(formatCurrency(-500.99)).toBe('-$500.99');
  });

  it('formats large values', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });
});

describe('formatPercent', () => {
  it('formats positive percent with plus sign', () => {
    expect(formatPercent(3.14)).toBe('+3.14%');
  });

  it('formats negative percent', () => {
    expect(formatPercent(-2.5)).toBe('-2.50%');
  });

  it('formats zero percent', () => {
    expect(formatPercent(0)).toBe('+0.00%');
  });
});

describe('formatCompactCurrency', () => {
  it('formats billions', () => {
    expect(formatCompactCurrency(2830000000)).toBe('$2.83B');
  });

  it('formats millions', () => {
    expect(formatCompactCurrency(53800000)).toBe('$53.80M');
  });

  it('formats thousands', () => {
    expect(formatCompactCurrency(5000)).toBe('$5.00K');
  });

  it('formats small values', () => {
    expect(formatCompactCurrency(500)).toBe('$500.00');
  });
});

describe('formatVolume', () => {
  it('formats millions', () => {
    expect(formatVolume(58420000)).toBe('58.4M');
  });

  it('formats thousands', () => {
    expect(formatVolume(5000)).toBe('5.0K');
  });

  it('formats small values', () => {
    expect(formatVolume(500)).toBe('500');
  });
});

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('Jan');
    expect(result).toContain('2024');
    // Day may vary by timezone
    expect(result).toMatch(/Jan \d+, 2024/);
  });
});

describe('formatDateTime', () => {
  it('formats ISO datetime string', () => {
    const result = formatDateTime('2024-01-15T09:30:00Z');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });
});

describe('getTradeGain', () => {
  it('calculates BUY gain correctly', () => {
    const gain = getTradeGain(100, 150, 'BUY');
    expect(gain).toBe(50);
  });

  it('calculates BUY loss correctly', () => {
    const gain = getTradeGain(100, 80, 'BUY');
    expect(gain).toBe(-20);
  });

  it('calculates SELL gain correctly', () => {
    const gain = getTradeGain(100, 80, 'SELL');
    expect(gain).toBe(20);
  });

  it('calculates SELL loss correctly', () => {
    const gain = getTradeGain(100, 120, 'SELL');
    expect(gain).toBe(-20);
  });

  it('returns 0 when price unchanged', () => {
    expect(getTradeGain(100, 100, 'BUY')).toBe(0);
    expect(getTradeGain(100, 100, 'SELL')).toBe(0);
  });
});

describe('getTradeGainValue', () => {
  it('calculates BUY dollar gain', () => {
    const gain = getTradeGainValue(100, 150, 10, 'BUY');
    expect(gain).toBe(500);
  });

  it('calculates SELL dollar gain', () => {
    const gain = getTradeGainValue(100, 80, 10, 'SELL');
    expect(gain).toBe(200);
  });

  it('calculates BUY dollar loss', () => {
    const gain = getTradeGainValue(100, 90, 10, 'BUY');
    expect(gain).toBe(-100);
  });
});

describe('getConvictionLabel', () => {
  it('returns correct labels', () => {
    expect(getConvictionLabel(1)).toBe('LOW');
    expect(getConvictionLabel(2)).toBe('MODERATE');
    expect(getConvictionLabel(3)).toBe('MEDIUM');
    expect(getConvictionLabel(4)).toBe('HIGH');
    expect(getConvictionLabel(5)).toBe('MAXIMUM');
  });

  it('returns UNKNOWN for invalid values', () => {
    expect(getConvictionLabel(0)).toBe('UNKNOWN');
    expect(getConvictionLabel(6)).toBe('UNKNOWN');
  });
});

describe('getConvictionColor', () => {
  it('returns valid colors for all conviction levels', () => {
    for (let i = 1; i <= 5; i++) {
      const color = getConvictionColor(i);
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('returns default color for invalid values', () => {
    expect(getConvictionColor(0)).toBe('#8b949e');
  });
});

describe('getDaysSince', () => {
  it('returns positive days for past date', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);
    const days = getDaysSince(pastDate.toISOString());
    expect(days).toBe(10);
  });

  it('returns 0 for today', () => {
    const today = new Date().toISOString();
    const days = getDaysSince(today);
    expect(days).toBe(0);
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('handles undefined', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
  });
});
