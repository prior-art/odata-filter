import tokenHandler from './tokenHandler';
import defaultLexer from './defaultLexer';
import { TokenType } from './types';

describe('#tokenHandler', () => {
  test('it tracks token position during processing', () => {
    const lexerStub = defaultLexer;
    const typeStub = TokenType.WHITESPACE;
    const valueStub = ' ';

    tokenHandler(lexerStub, typeStub, valueStub);

    expect(lexerStub.pos).toEqual(1);
    expect(lexerStub.source).toEqual('');
  });
});
