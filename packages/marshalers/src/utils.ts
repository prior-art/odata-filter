import type { TokenValue } from '@odata-filter/core';

export const toStringValue = (value: TokenValue | null | undefined): string =>
  typeof value === 'string' ? value : String(value ?? '');

export const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
