export type FragmentType =
  | 'field'
  | 'comparison'
  | 'logical'
  | 'open'
  | 'close'
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'tuple'
  | 'function';

export type Fragment = {
  type: FragmentType;
  value: string;
};

export type BuilderState = {
  fragments: Fragment[];
};

export const createBuilderState = (): BuilderState => ({ fragments: [] });

export const appendFragment = (state: BuilderState, fragment: Fragment): BuilderState => ({
  fragments: [...state.fragments, fragment],
});

export const removeLastFragment = (state: BuilderState): BuilderState => ({
  fragments: state.fragments.slice(0, -1),
});

export const clearBuilderState = (): BuilderState => createBuilderState();

export const replaceBuilderState = (text: string): BuilderState => ({
  fragments: text
    ? [{ type: 'field', value: text }]
    : [],
});

export const serializeBuilder = (state: BuilderState): string =>
  state.fragments
    .map((fragment) => {
      switch (fragment.type) {
        case 'string':
          return `'${fragment.value.replaceAll("'", "''")}'`;
        case 'open':
          return '(';
        case 'close':
          return ')';
        case 'tuple':
          return `(${fragment.value
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean)
            .map((value) => /^\-?\d+(?:\.\d+)?$/.test(value) ? value : `'${value.replaceAll("'", "''")}'`)
            .join(', ')})`;
          case 'function':
            return `${fragment.value}(`;
        default:
          return fragment.value;
      }
    })
    .join(' ');
