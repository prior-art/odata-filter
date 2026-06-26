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
