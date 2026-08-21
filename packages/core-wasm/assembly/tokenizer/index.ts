import { Token, TokenType } from './types';
import { patterns, reservedKeywordLookup } from './lookups';
import { Match } from '@prior-art/assemblyscript-regex/assembly/regexp';
import { format } from './formatter';

function pushStringFunction(raw: string, tokenPos: i32, tokens: Array<Token>, operatorType: TokenType, operatorRaw: string): void {
  const functionName = raw.substring(0, raw.indexOf('('));
  const inner = raw.substring(functionName.length + 1, raw.length - 1).trim();
  const commaIdx = inner.indexOf(',');
  const fieldName = inner.substring(0, commaIdx).trim();
  const stringValue = inner.substring(commaIdx + 1).trim();

  tokens.push({ type: TokenType.SYMBOL, value: format(TokenType.SYMBOL, fieldName), position: tokenPos } as Token);
  tokens.push({ type: operatorType, value: format(operatorType, operatorRaw), position: tokenPos + fieldName.length } as Token);
  tokens.push({ type: TokenType.STRING, value: format(TokenType.STRING, stringValue), position: tokenPos + fieldName.length + functionName.length } as Token);
}

function functionHandler(raw: string, tokenPos: i32, tokens: Array<Token>): void {
  const functionName = raw.substring(0, raw.indexOf('('));

  switch (functionName) {
    case 'contains': {
      pushStringFunction(raw, tokenPos, tokens, TokenType.CONTAINS, 'contains');
      return;
    }
    case 'startswith': {
      pushStringFunction(raw, tokenPos, tokens, TokenType.STARTSWITH, 'startswith');
      return;
    }
    case 'trim': {
      const inner = raw.substring(functionName.length + 1, raw.length - 1).trim();

      tokens.push({ type: TokenType.TRIM, value: format(TokenType.TRIM, 'trim'), position: tokenPos } as Token);
      tokens.push({ type: TokenType.SYMBOL, value: format(TokenType.SYMBOL, inner), position: tokenPos + functionName.length + 1 } as Token);
      return;
    }
    default: {
      tokens.push({ type: reservedKeywordLookup.has(raw) ? reservedKeywordLookup.get(raw) : TokenType.FUNCTION, value: format(TokenType.FUNCTION, raw), position: tokenPos } as Token);
    }
  }
}

export function tokenize(input: string): Array<Token> {
  const tokens = new Array<Token>();
  let tokenPos = 0;

  while (tokenPos < input.length) {
    let matched = false;

    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      const substring = input.substring(tokenPos);
      const match: Match | null = pattern.regex.exec(substring);

      if (match && match.index == 0) {
        const firstMatch = match.matches[0];

        if (pattern.type === TokenType.FUNCTION) {
          functionHandler(firstMatch, tokenPos, tokens);
          tokenPos += firstMatch.length;
          matched = true;
          break;
        }

        tokens.push({
          type: reservedKeywordLookup.has(firstMatch) ? reservedKeywordLookup.get(firstMatch) : pattern.type,
          value: format(pattern.type, firstMatch),
          position: tokenPos,
        } as Token);

        tokenPos += firstMatch.length;
        matched = true;
        break;
      }

      continue;
    }

    if (!matched) {
      throw new Error(
        `Unexpected token ${input[tokenPos]} at position ${tokenPos}`,
      );
    }
  }

  return tokens;
}
