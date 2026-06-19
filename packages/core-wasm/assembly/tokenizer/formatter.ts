import { TokenFormat, TokenType, TokenValue } from './types';

export function format(type: TokenType, value: string): TokenValue {
  switch (type) {
    case TokenType.BOOLEAN: {
      return {
        format: TokenFormat.BOOLEAN,
        raw: value,
        boolValue: value === 'true',
      };
    }
    case TokenType.NULL: {
      return {
        format: TokenFormat.NULL,
        raw: value,
      };
    }
    case TokenType.STRING: {
      const trimmed = value.trim();

      return {
        format: TokenFormat.STRING,
        raw: trimmed,
        stringValue: trimmed.slice(1, -1),
      };
    }
    case TokenType.NUMBER: {
      const intValue = parseFloat(value);
      const isFloat = intValue % 1 !== 0;
      const token = {
        format: isFloat ? TokenFormat.FLOAT : TokenFormat.INTEGER,
        raw: value.trim(),
      } as TokenValue;

      if (isFloat) {
        token.floatValue = parseFloat(value) as f32;
        return token;
      }

      token.intValue = intValue as i32;
      return token;
    }
    case TokenType.TUPLE: {
      const arr = value.slice(1, -1).split(',');

      return {
        format: TokenFormat.TUPLE,
        raw: value,
        arrayValue: arr.map<TokenValue>((t) => {
          if (parseFloat(t)) {
            return format(TokenType.NUMBER, t);
          }

          return format(TokenType.STRING, t);
        }),
      };
    }
    default: {
      return { format: TokenFormat.STRING, raw: value, stringValue: value };
    }
  }
}
