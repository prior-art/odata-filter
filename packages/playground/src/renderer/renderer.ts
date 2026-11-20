import {
  appendFragment,
  clearBuilderState,
  removeLastFragment,
  replaceBuilderState,
  serializeBuilder,
  type BuilderState,
  type Fragment,
  type FragmentType,
} from '../builder/model';
import './style.css';

const exampleSchema: JsonSchema = {
  name: { type: 'string' },
  age: { type: 'number' },
  country: { type: 'string' },
  active: { type: 'boolean' },
  email: { type: 'string' },
};

let state: BuilderState = clearBuilderState();
let history: BuilderState[] = [];
let schema = exampleSchema;

const expression = document.querySelector<HTMLTextAreaElement>('#expression')!;
const tokens = document.querySelector<HTMLElement>('#tokens')!;
const ast = document.querySelector<HTMLElement>('#ast')!;
const validationStatus = document.querySelector<HTMLElement>('#validation-status')!;

const addComparisonButtons = (): void => {
  const container = document.querySelector<HTMLElement>('#comparison-buttons')!;
  for (const value of ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in']) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.fragment = 'comparison';
    button.dataset.value = value;
    button.textContent = value;
    container.append(button);
  }
};

const astText = (value: unknown): string =>
  JSON.stringify(value, null, 2);

const commit = (next: BuilderState): void => {
  state = next;
  history = [...history, state];
  expression.value = serializeBuilder(state);
  refresh();
};

const refresh = async (): Promise<void> => {
  const text = expression.value.trim();

  if (!text) {
    tokens.textContent = '';
    ast.textContent = '';
    validationStatus.textContent = 'Valid';
    validationStatus.classList.remove('error');
    return;
  }

    const tokenList = await window.odataApi.tokenize(text);
    const parsed = await window.odataApi.parse(tokenList);
    tokens.textContent = astText(tokenList);
    ast.textContent = astText(parsed);

    if (tokenList.error || parsed.error) {
      validationStatus.textContent = 'Invalid';
      validationStatus.classList.add('error');
      return;
    }

    validationStatus.textContent = 'Valid';
    validationStatus.classList.remove('error');
};

addComparisonButtons();

expression.addEventListener('input', () => {
  state = replaceBuilderState(expression.value);
  history = [...history, state];
  refresh();
});

document.querySelector<HTMLButtonElement>('#add-field')!.addEventListener('click', () => {
  const field = document.querySelector<HTMLInputElement>('#field')!.value.trim();
  if (field) {
    commit(appendFragment(state, { type: 'field', value: field }));
  }
});

document.querySelector<HTMLElement>('.builder')!.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-fragment]');
  if (!button) {
    return;
  }

  const type = button.dataset.fragment as FragmentType;
  const value = button.dataset.value ?? '';
  commit(appendFragment(state, { type, value }));
});

document.querySelector<HTMLButtonElement>('#add-literal')!.addEventListener('click', () => {
  const type = document.querySelector<HTMLSelectElement>('#literal-type')!.value as FragmentType;
  const value = document.querySelector<HTMLInputElement>('#literal-value')!.value.trim();

  if (type === 'null') {
    commit(appendFragment(state, { type, value: 'null' }));
    return;
  }

  if (type === 'tuple') {
    if (!value) {
      validationStatus.textContent = 'Enter comma-separated tuple values';
      validationStatus.classList.add('error');
      return;
    }

    commit(appendFragment(state, { type, value }));
    return;
  }

  if (type === 'boolean' && value !== 'true' && value !== 'false') {
    validationStatus.textContent = 'Boolean literals must be true or false';
    validationStatus.classList.add('error');
    return;
  }

  if (type === 'number' && !/^-?\d+(?:\.\d+)?$/.test(value)) {
    validationStatus.textContent = 'Enter a valid number';
    validationStatus.classList.add('error');
    return;
  }

  if (value) {
    commit(appendFragment(state, { type, value }));
  }
});

document.querySelector<HTMLButtonElement>('#remove-last')!.addEventListener('click', () => {
  commit(removeLastFragment(state));
});

document.querySelector<HTMLButtonElement>('#undo')!.addEventListener('click', () => {
  history = history.slice(0, -1);
  state = history.at(-1) ?? clearBuilderState();
  expression.value = serializeBuilder(state);
  refresh();
});

document.querySelector<HTMLButtonElement>('#reset')!.addEventListener('click', () => {
  state = clearBuilderState();
  history.length = 0;
  expression.value = '';
  refresh();
});

document.querySelector<HTMLButtonElement>('#copy')!.addEventListener('click', () => {
  void window.playgroundApi.copyText(expression.value);
});

document.querySelector<HTMLButtonElement>('#save')!.addEventListener('click', () => {
  const content = JSON.stringify({ expression: expression.value, schema }, null, 2);
  void window.playgroundApi.saveJson('odata-filter-playground.json', content);
});

document.querySelector<HTMLButtonElement>('#load')!.addEventListener('click', async () => {
  const content = await window.playgroundApi.openFile('Load playground JSON', ['json']);
  if (!content) {
    return;
  }

  const saved = JSON.parse(content) as { expression?: string; schema?: JsonSchema };
  expression.value = saved.expression ?? '';
  state = replaceBuilderState(expression.value);
  history.length = 0;
  history.push(state);
  if (saved.schema) {
    schema = saved.schema;
  }
  refresh();
});

document.querySelector<HTMLButtonElement>('#load-schema')!.addEventListener('click', async () => {
  const content = await window.playgroundApi.openFile('Load JSON schema', ['json']);
  if (!content) {
    return;
  }

  schema = JSON.parse(content) as JsonSchema;
  refresh();
});

refresh();
