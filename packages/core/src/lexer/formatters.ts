import { LexerException } from './exceptions';
import { Temporal } from '@js-temporal/polyfill';

export const defaultFormatter = (value: string): string => {
  return value;
};

export const stringFormatter = (value: string): string => {
  return value.replace(/^'|'$|\\/g, '');
};

export const numberFormatter = (value: string): number => {
  return parseFloat(value);
};

export const booleanFormatter = (value: string): boolean => {
  return value === 'true';
};

export const nullFormatter = (): null => {
  return null;
};

export const tupleFormatter = (value: string): (number | string)[] => {
  return value
    .slice(1, -1)
    .split(',')
    .map((item) => {
      item = item.trim().replace(/'/g, '');

      return +item || item;
    });
};

export const dateFormatter = (value: string): Temporal.PlainDate => {
  try {
    return Temporal.PlainDate.from(value);
  } catch (error) {
    if (error instanceof RangeError) {
      throw new LexerException(`Invalid date format: ${value}`);
    }
    throw error;
  }
};

export const datetimeFormatter = (value: string): Temporal.Instant => {
  try {
    return Temporal.Instant.from(value);
  } catch (error) {
    if (error instanceof RangeError) {
      console.error(error);
      throw new LexerException(`Invalid datetime format: ${value}`);
    }
    throw error;
  }
};

export const timeFormatter = (value: string): Temporal.PlainTime => {
  try {
    return Temporal.PlainTime.from(value);
  } catch (error) {
    if (error instanceof RangeError) {
      throw new LexerException(`Invalid time format: ${value}`);
    }
    throw error;
  }
};


export const durationFormatter = (value: string): Temporal.Duration => {
  try {
    return Temporal.Duration.from(value);
  } catch (error) {
    if (error instanceof RangeError) {
      throw new LexerException(`Invalid duration format: ${value}`);
    }
    throw error;
  }
};
