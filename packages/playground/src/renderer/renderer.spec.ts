import { beforeEach, describe, expect, test, vi } from 'vitest';

class FakeElement {
  value = '';
  type = '';
  textContent = '';
  dataset: Record<string, string> = {};
  classList = {
    add: vi.fn(),
    remove: vi.fn(),
  };
  children: FakeElement[] = [];
  listeners = new Map<string, (event: any) => unknown>();

  addEventListener(type: string, listener: (event: any) => unknown): void {
    this.listeners.set(type, listener);
  }

  append(child: FakeElement): void {
    this.children.push(child);
  }

  closest(selector: string = ''): FakeElement | null {
    if (!this.dataset.fragment) {
      return null;
    }
    return selector === 'button[data-fragment]' ? this : null;
  }

  dispatch(type: string, event: Record<string, unknown> = {}): unknown {
    return this.listeners.get(type)?.({ target: this, ...event });
  }
}

const mocks = vi.hoisted(() => ({
  copyText: vi.fn(),
  saveJson: vi.fn(),
  openFile: vi.fn(),
  tokenize: vi.fn(),
  parse: vi.fn(),
  appendFragment: vi.fn(),
}));

vi.mock('./style.css', () => ({}));

vi.mock('../builder/model', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../builder/model')>();
  return {
    ...actual,
    appendFragment: (state: unknown, fragment: unknown) => {
      mocks.appendFragment(state, fragment);
      return actual.appendFragment(state as Parameters<typeof actual.appendFragment>[0], fragment as Parameters<typeof actual.appendFragment>[1]);
    },
  };
});

const elements = new Map<string, FakeElement>();
let comparisonButtons: FakeElement;
let createElement: ReturnType<typeof vi.fn>;

const element = (selector: string): FakeElement => {
  const found = elements.get(selector);
  if (!found) {
    throw new Error(`Unknown selector: ${selector}`);
  }
  return found;
};

const loadRenderer = async (): Promise<void> => {
  vi.resetModules();
  elements.clear();
  [
    '#expression',
    '#tokens',
    '#ast',
    '#validation-status',
    '#comparison-buttons',
    '#add-field',
    '#field',
    '.builder',
    '#add-literal',
    '#literal-type',
    '#literal-value',
    '#remove-last',
    '#undo',
    '#reset',
    '#copy',
    '#save',
    '#load',
    '#load-schema',
  ].forEach((selector) => elements.set(selector, new FakeElement()));
  comparisonButtons = element('#comparison-buttons');

  createElement = vi.fn(() => new FakeElement());
  vi.stubGlobal('document', {
    querySelector: (selector: string) => elements.get(selector) ?? null,
    getElementById: (selector: string) => elements.get(`#${selector}`) ?? null,
    createElement,
  });
  vi.stubGlobal('window', {
    playgroundApi: {
      copyText: mocks.copyText,
      saveJson: mocks.saveJson,
      openFile: mocks.openFile,
    },
    odataApi: {
      tokenize: mocks.tokenize,
      parse: mocks.parse,
    },
  });
  mocks.tokenize.mockResolvedValue(['token']);
  mocks.parse.mockResolvedValue({ type: 'expression' });
  mocks.openFile.mockResolvedValue(null);

  await import('./renderer');
  await vi.waitFor(() => {
    expect(element('#validation-status').textContent).toBe('Valid');
  });
};

const click = async (selector: string): Promise<void> => {
  const result = element(selector).dispatch('click');
  if (result instanceof Promise) {
    await result;
  }
  await Promise.resolve();
};

describe('renderer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('load cancels without content and loads then refreshes saved content', async () => {
    await loadRenderer();
    element('#expression').value = 'keep eq value';
    mocks.openFile.mockResolvedValueOnce(null);
    await click('#load');
    expect(element('#expression').value).toBe('keep eq value');

    mocks.openFile.mockResolvedValueOnce(JSON.stringify({
      expression: 'name eq Ada',
      schema: { name: { type: 'string' } },
    }));
    await click('#load');
    expect(element('#expression').value).toBe('name eq Ada');
    expect(mocks.tokenize).toHaveBeenCalledWith('name eq Ada');
    await vi.waitFor(() => expect(element('#ast').textContent).toContain('expression'));
  });

  test('adds comparison choices and supports field, delegated, remove, undo, and reset actions', async () => {
    await loadRenderer();
    await click('#undo');
    expect(element('#expression').value).toBe('');
    expect(comparisonButtons.children).toHaveLength(7);
    expect(createElement).toHaveBeenCalledTimes(7);
    expect(createElement).toHaveBeenCalledWith('button');
    expect(comparisonButtons.children.map((button) => ({
      type: button.type,
      fragment: button.dataset.fragment,
      value: button.dataset.value,
      text: button.textContent,
    }))).toEqual(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in'].map((value) => ({
      type: 'button',
      fragment: 'comparison',
      value,
      text: value,
    })));

    await click('#add-field');
    expect(element('#expression').value).toBe('');
    element('#field').value = '  age  ';
    await click('#add-field');
    expect(element('#expression').value).toBe('age');
    expect(mocks.appendFragment).toHaveBeenCalledWith(
      expect.anything(),
      { type: 'field', value: 'age' },
    );
    expect(mocks.tokenize).toHaveBeenCalledWith('age');
    expect(element('#expression').value).not.toBe('');
    expect(mocks.tokenize).toHaveBeenCalledWith('age');

    await element('.builder').dispatch('click', { target: new FakeElement() });
    const comparison = new FakeElement();
    comparison.dataset = { fragment: 'comparison', value: 'eq' };
    await element('.builder').dispatch('click', { target: comparison });
    expect(element('#expression').value).toBe('age eq');

    await click('#remove-last');
    expect(element('#expression').value).toBe('age');
    expect(mocks.tokenize).toHaveBeenCalledWith('age');
    await click('#undo');
    expect(element('#expression').value).toBe('age eq');
    expect(mocks.tokenize).toHaveBeenCalledWith('age eq');
    await click('#reset');
    expect(element('#expression').value).toBe('');
    expect(element('#tokens').textContent).toBe('');
    expect(element('#ast').textContent).toBe('');
    await click('#undo');
    expect(element('#expression').value).toBe('');
    expect(element('#expression').value).toBe('');

    const functionButton = new FakeElement();
    functionButton.dataset = { fragment: 'function' };
    await element('.builder').dispatch('click', { target: functionButton });
    expect(element('#expression').value).toBe('(');

    element('#field').value = 'name';
    await click('#add-field');
    const at = vi.spyOn(Array.prototype, 'at').mockReturnValue(undefined);
    try {
      element('#undo').dispatch('click');
    } finally {
      at.mockRestore();
    }
    expect(element('#expression').value).toBe('');
  });

  test('validates literals and serializes accepted values', async () => {
    await loadRenderer();
    element('#literal-type').value = 'null';
    await click('#add-literal');
    expect(element('#expression').value).toBe('null');

    element('#literal-type').value = 'tuple';
    element('#literal-value').value = '';
    await click('#add-literal');
    expect(element('#validation-status').textContent).toBe('Enter comma-separated tuple values');
    expect(element('#validation-status').classList.add).toHaveBeenCalledWith('error');
    expect(element('#validation-status').classList.add).not.toHaveBeenCalledWith('');
    element('#literal-value').value = '1, Ada';
    await click('#add-literal');
    expect(element('#expression').value).toBe("null (1, 'Ada')");

    element('#literal-type').value = 'boolean';
    element('#literal-value').value = 'yes';
    await click('#add-literal');
    expect(element('#validation-status').textContent).toBe('Boolean literals must be true or false');
    expect(element('#validation-status').classList.add).not.toHaveBeenCalledWith('');
    element('#literal-value').value = 'false';
    await click('#add-literal');
    expect(element('#expression').value).toBe("null (1, 'Ada') false");
    element('#literal-value').value = 'true';
    await click('#add-literal');
    expect(element('#expression').value).toBe("null (1, 'Ada') false true");

    element('#literal-type').value = 'number';
    element('#literal-value').value = '1e2';
    await click('#add-literal');
    expect(element('#validation-status').textContent).toBe('Enter a valid number');
    expect(element('#validation-status').classList.add).not.toHaveBeenCalledWith('');
    element('#literal-value').value = '-12.5';
    await click('#add-literal');
    expect(element('#expression').value).toBe("null (1, 'Ada') false true -12.5");
    element('#literal-value').value = '12.345';
    await click('#add-literal');
    expect(element('#expression').value).toBe("null (1, 'Ada') false true -12.5 12.345");
    element('#literal-value').value = '42';
    await click('#add-literal');
    expect(element('#expression').value).toBe("null (1, 'Ada') false true -12.5 12.345 42");
    element('#literal-value').value = '12.345x';
    await click('#add-literal');
    expect(element('#validation-status').textContent).toBe('Enter a valid number');

    element('#literal-type').value = 'string';
    element('#literal-value').value = '  ';
    await click('#add-literal');
    element('#literal-value').value = " O'Brien ";
    await click('#add-literal');
    expect(element('#expression').value).toBe("null (1, 'Ada') false true -12.5 12.345 42 'O''Brien'");
  });

  test('refreshes valid and invalid expressions and handles direct edits', async () => {
    await loadRenderer();
    element('#expression').value = 'age eq 21';
    await element('#expression').dispatch('input');
    await vi.waitFor(() => expect(element('#ast').textContent).toContain('expression'));
    expect(element('#tokens').textContent).toContain('token');
    expect(element('#validation-status').textContent).toBe('Valid');
    expect(element('#validation-status').classList.remove).toHaveBeenCalledWith('error');
    expect(element('#validation-status').classList.remove).not.toHaveBeenCalledWith('');
    expect(mocks.tokenize).toHaveBeenCalledWith('age eq 21');
    expect(mocks.parse).toHaveBeenCalled();
    await click('#undo');
    expect(element('#expression').value).toBe('');
    expect(element('#ast').textContent).toBe('');
    expect(element('#tokens').textContent).toBe('');

    mocks.parse.mockResolvedValueOnce({ error: 'parse error' });
    element('#expression').value = 'bad parse';
    await element('#expression').dispatch('input');
    await vi.waitFor(() => expect(element('#validation-status').textContent).toBe('Invalid'));
    expect(element('#validation-status').classList.add).toHaveBeenCalledWith('error');

    mocks.tokenize.mockResolvedValueOnce({ error: 'token error' });
    element('#expression').value = 'bad token';
    await element('#expression').dispatch('input');
    await vi.waitFor(() => expect(element('#validation-status').textContent).toBe('Invalid'));

    element('#expression').value = '  ';
    await element('#expression').dispatch('input');
    expect(element('#tokens').textContent).toBe('');
    expect(element('#ast').textContent).toBe('');
    expect(element('#validation-status').classList.remove).toHaveBeenCalledWith('error');
  });

  test('copies and saves the expression and handles loaded data and schemas', async () => {
    await loadRenderer();
    element('#expression').value = 'keep eq value';
    mocks.openFile.mockResolvedValueOnce(null);
    await click('#load');
    expect(element('#expression').value).toBe('keep eq value');
    element('#expression').value = 'age eq 21';
    await click('#copy');
    expect(mocks.copyText).toHaveBeenCalledWith('age eq 21');
    await click('#save');
    expect(mocks.saveJson).toHaveBeenCalledWith(
      'odata-filter-playground.json',
      JSON.stringify({
        expression: 'age eq 21',
        schema: {
          name: { type: 'string' },
          age: { type: 'number' },
          country: { type: 'string' },
          active: { type: 'boolean' },
          email: { type: 'string' },
        },
      }, null, 2),
    );

    await click('#load');
    mocks.openFile.mockResolvedValueOnce(JSON.stringify({}));
    await click('#load');
    expect(element('#expression').value).toBe('');
    expect(mocks.openFile).toHaveBeenCalledWith('Load playground JSON', ['json']);
    await click('#save');
    expect(mocks.saveJson).toHaveBeenLastCalledWith(
      'odata-filter-playground.json',
      JSON.stringify({
        expression: '',
        schema: {
          name: { type: 'string' },
          age: { type: 'number' },
          country: { type: 'string' },
          active: { type: 'boolean' },
          email: { type: 'string' },
        },
      }, null, 2),
    );

    mocks.openFile.mockResolvedValueOnce(JSON.stringify({
      expression: 'name eq Ada',
      schema: { name: { type: 'string' } },
    }));
    await click('#load');
    expect(element('#expression').value).toBe('name eq Ada');
    expect(mocks.tokenize).toHaveBeenCalledWith('name eq Ada');
    await vi.waitFor(() => expect(element('#ast').textContent).toContain('expression'));
    element('#expression').value = 'country eq US';
    await element('#expression').dispatch('input');
    await vi.waitFor(() => expect(element('#ast').textContent).toContain('expression'));
    await click('#undo');
    expect(element('#expression').value).toBe('name eq Ada');
    await click('#save');
    expect(mocks.saveJson).toHaveBeenCalledWith(
      'odata-filter-playground.json',
      JSON.stringify({
        expression: 'name eq Ada',
        schema: { name: { type: 'string' } },
      }, null, 2),
    );

    const tokenizeCalls = mocks.tokenize.mock.calls.length;
    const parseCalls = mocks.parse.mock.calls.length;
    mocks.openFile.mockResolvedValueOnce(null);
    await click('#load-schema');
    expect(mocks.tokenize).toHaveBeenCalledTimes(tokenizeCalls);
    expect(mocks.parse).toHaveBeenCalledTimes(parseCalls);

    const refreshTokenizeCalls = mocks.tokenize.mock.calls.length;
    const refreshParseCalls = mocks.parse.mock.calls.length;
    mocks.openFile.mockResolvedValueOnce(JSON.stringify({ age: { type: 'number' } }));
    await click('#load-schema');
    expect(mocks.openFile).toHaveBeenLastCalledWith('Load JSON schema', ['json']);
    await vi.waitFor(() => {
      expect(mocks.tokenize.mock.calls.length).toBeGreaterThan(refreshTokenizeCalls);
      expect(mocks.parse.mock.calls.length).toBeGreaterThan(refreshParseCalls);
    });
    await click('#save');
    expect(mocks.saveJson).toHaveBeenLastCalledWith(
      'odata-filter-playground.json',
      JSON.stringify({
        expression: 'name eq Ada',
        schema: { age: { type: 'number' } },
      }, null, 2),
    );
  });
});
