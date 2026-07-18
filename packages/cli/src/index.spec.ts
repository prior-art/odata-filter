import { describe, test, vi } from 'vitest';
import { createCommand } from './cli.js';

vi.mock('./cli.js');

describe('index', () => {
  test('it initializes the command', async () => {
    const mockParse = vi.fn();
    createCommand.mockReturnValue({
      parse: mockParse,
    });

    await import('./index.js');

    expect(createCommand).toHaveBeenCalledTimes(1);
    expect(createCommand).toHaveBeenCalledWith();
    expect(mockParse).toHaveBeenCalledWith(process.argv);
    expect(mockParse).toHaveBeenCalledTimes(1);
  });
});
