interface PlaygroundApi {
  copyText(text: string): Promise<void>;
  saveJson(defaultName: string, content: string): Promise<string | null>;
  openFile(title: string, extensions: string[]): Promise<string | null>;
}

interface Window {
  playgroundApi: PlaygroundApi;
  odataApi: {
    tokenize(filter: string): Promise<ODataTokenList>;
    parse(tokens: unknown): Promise<ODataParseResult>;
  };
}

interface ODataTokenList extends Array<unknown> {
  error?: string;
}

interface ODataParseResult {
  error?: string;
  [key: string]: unknown;
}

interface JsonSchema {
  [field: string]: {
    type: 'string' | 'number' | 'boolean';
  };
}
