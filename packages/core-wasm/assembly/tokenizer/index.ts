import { Token, TokenType } from './types';
import { patterns, reservedKeywordLookup } from './lookups';
import { Match } from '@prior-art/assemblyscript-regex/assembly/regexp';
import { format } from './formatter';

function handleContainsFunction(raw: string, tokenPos: i32, tokens: Array<Token>): void {
  const openParen = raw.indexOf('(');
  const inner = raw.substring(openParen + 1, raw.length - 1).trim();
  const commaIdx = inner.indexOf(',');
  const fieldName = inner.substring(0, commaIdx).trim();
  const stringValue = inner.substring(commaIdx + 1).trim();

  tokens.push({
    type: TokenType.SYMBOL,
    value: format(TokenType.SYMBOL, fieldName),
    position: tokenPos,
  } as Token);
  tokens.push({
    type: TokenType.CONTAINS,
    value: format(TokenType.CONTAINS, 'contains'),
    position: tokenPos + fieldName.length,
  } as Token);
  tokens.push({
    type: TokenType.STRING,
    value: format(TokenType.STRING, stringValue),
    position: tokenPos + fieldName.length + 'contains'.length,
  } as Token);
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
          const functionName = firstMatch.substring(0, firstMatch.indexOf('('));

          if (functionName === 'contains') {
            handleContainsFunction(firstMatch, tokenPos, tokens);
          } else {
            const formattedValue = format(pattern.type, firstMatch);
            const token = {
              type: reservedKeywordLookup.has(firstMatch) ? reservedKeywordLookup.get(firstMatch) : pattern.type,
              value: formattedValue,
              position: tokenPos,
            } as Token;
            tokens.push(token);
          }
        } else {
          const formattedValue = format(pattern.type, firstMatch);
          const token = {
            type: reservedKeywordLookup.has(firstMatch) ? reservedKeywordLookup.get(firstMatch) : pattern.type,
            value: formattedValue,
            position: tokenPos,
          } as Token;
          tokens.push(token);
        }

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
