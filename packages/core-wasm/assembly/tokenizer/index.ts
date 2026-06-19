import { Token } from './types';
import { patterns } from './lookups';
import { Match } from '@prior-art/assemblyscript-regex/assembly/regexp';
import { format } from './formatter';

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
        const formattedValue = format(pattern.type, firstMatch);
        const token = {
          type: pattern.type,
          value: formattedValue,
          position: tokenPos,
        } as Token;
        tokens.push(token);

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
