import { TokenType, Token } from '../tokenizer/types';
import { ParseStrategy, NodeType, BindingPower } from './types';

export class Parser {
  tokens: Array<Token>;
  pos: i32 = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  nextToken(): void {
    this.pos = this.pos + 1;
  }

  nodeType(): NodeType {
    const current = this.getCurrentToken();

    const lookup = new Map<TokenType, NodeType>();
    lookup.set(TokenType.AND, NodeType.LOGICAL_OPERATOR);
    lookup.set(TokenType.OR, NodeType.LOGICAL_OPERATOR);

    lookup.set(TokenType.EQ, NodeType.COMPARISON_OPERATOR);
    lookup.set(TokenType.NE, NodeType.COMPARISON_OPERATOR);
    lookup.set(TokenType.LT, NodeType.COMPARISON_OPERATOR);
    lookup.set(TokenType.LTE, NodeType.COMPARISON_OPERATOR);
    lookup.set(TokenType.GT, NodeType.COMPARISON_OPERATOR);
    lookup.set(TokenType.GTE, NodeType.COMPARISON_OPERATOR);
    lookup.set(TokenType.IN, NodeType.COMPARISON_OPERATOR);

    lookup.set(TokenType.NOT, NodeType.UNARY_OPERATOR);

    lookup.set(TokenType.WHITESPACE, NodeType.DEFAULT);
    lookup.set(TokenType.OPEN_PAREN, NodeType.DEFAULT);
    lookup.set(TokenType.CLOSE_PAREN, NodeType.DEFAULT);

    lookup.set(TokenType.SYMBOL, NodeType.FIELD);

    lookup.set(TokenType.STRING, NodeType.STRING_LITERAL);
    lookup.set(TokenType.NUMBER, NodeType.NUMBER_LITERAL);
    lookup.set(TokenType.BOOLEAN, NodeType.BOOLEAN_LITERAL);
    lookup.set(TokenType.NULL, NodeType.NULL);
    lookup.set(TokenType.TUPLE, NodeType.ARRAY);
    lookup.set(TokenType.DURATION, NodeType.DURATION_LITERAL);
    lookup.set(TokenType.DATETIME, NodeType.DATETIME_LITERAL);
    lookup.set(TokenType.DATE, NodeType.DATE_LITERAL);
    lookup.set(TokenType.TIME, NodeType.TIME_LITERAL);

    return lookup[current.type];
  }

  parseStrategy(): ParseStrategy {
    const current = this.getCurrentToken();

    const lookup = new Map<TokenType, ParseStrategy>();
    lookup.set(TokenType.AND, ParseStrategy.LED);
    lookup.set(TokenType.OR, ParseStrategy.LED);
    lookup.set(TokenType.EQ, ParseStrategy.LED);
    lookup.set(TokenType.NE, ParseStrategy.LED);
    lookup.set(TokenType.GT, ParseStrategy.LED);
    lookup.set(TokenType.GTE, ParseStrategy.LED);
    lookup.set(TokenType.LT, ParseStrategy.LED);
    lookup.set(TokenType.LTE, ParseStrategy.LED);
    lookup.set(TokenType.IN, ParseStrategy.LED);

    lookup.set(TokenType.NOT, ParseStrategy.NUD);
    lookup.set(TokenType.STRING, ParseStrategy.NUD);
    lookup.set(TokenType.NUMBER, ParseStrategy.NUD);
    lookup.set(TokenType.BOOLEAN, ParseStrategy.NUD);
    lookup.set(TokenType.SYMBOL, ParseStrategy.NUD);
    lookup.set(TokenType.NULL, ParseStrategy.NUD);
    lookup.set(TokenType.TUPLE, ParseStrategy.NUD);
    lookup.set(TokenType.OPEN_PAREN, ParseStrategy.NUD);
    lookup.set(TokenType.DURATION, ParseStrategy.NUD);
    lookup.set(TokenType.DATETIME, ParseStrategy.NUD);
    lookup.set(TokenType.DATE, ParseStrategy.NUD);
    lookup.set(TokenType.TIME, ParseStrategy.NUD);

    lookup.set(TokenType.CLOSE_PAREN, ParseStrategy.DEFAULT);
    lookup.set(TokenType.WHITESPACE, ParseStrategy.DEFAULT);

    return lookup[current.type];
  }

  bindingPower(): BindingPower {
    const current = this.getCurrentToken();

    const lookup = new Map<TokenType, BindingPower>();
    lookup.set(TokenType.AND, BindingPower.LOGICAL);
    lookup.set(TokenType.OR, BindingPower.LOGICAL);
    lookup.set(TokenType.NOT, BindingPower.LOGICAL);

    lookup.set(TokenType.LT, BindingPower.COMPARISON);
    lookup.set(TokenType.LTE, BindingPower.COMPARISON);
    lookup.set(TokenType.GT, BindingPower.COMPARISON);
    lookup.set(TokenType.GTE, BindingPower.COMPARISON);
    lookup.set(TokenType.EQ, BindingPower.COMPARISON);
    lookup.set(TokenType.NE, BindingPower.COMPARISON);
    lookup.set(TokenType.IN, BindingPower.COMPARISON);

    lookup.set(TokenType.SYMBOL, BindingPower.FIELD);

    lookup.set(TokenType.STRING, BindingPower.LITERAL);
    lookup.set(TokenType.BOOLEAN, BindingPower.LITERAL);
    lookup.set(TokenType.NUMBER, BindingPower.LITERAL);
    lookup.set(TokenType.NULL, BindingPower.LITERAL);
    lookup.set(TokenType.TUPLE, BindingPower.LITERAL);
    lookup.set(TokenType.DURATION, BindingPower.LITERAL);
    lookup.set(TokenType.DATETIME, BindingPower.LITERAL);
    lookup.set(TokenType.DATE, BindingPower.LITERAL);
    lookup.set(TokenType.TIME, BindingPower.LITERAL);

    lookup.set(TokenType.WHITESPACE, BindingPower.DEFAULT);
    lookup.set(TokenType.OPEN_PAREN, BindingPower.DEFAULT);
    lookup.set(TokenType.CLOSE_PAREN, BindingPower.DEFAULT);

    return lookup[current.type];
  }

  getCurrentToken(): Token {
    if (this.pos >= this.tokens.length) {
      throw new Error('Token range execeeded.');
    }

    return this.tokens[this.pos];
  }
}
