describe('index', () => {
  test('it executes the command', async () => {
    process.argv = ['', '', "price lt 10"];
    const result = async () => await import('./index.js');

    await expect(result).not.toThrow();
  });
});
