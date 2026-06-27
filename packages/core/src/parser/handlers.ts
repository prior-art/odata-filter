import { Node, Parser, ParseStrategy, BindingPower } from './types';
import { bindingPowerLookup, parseStrategyLookup } from './lookups';
import { TokenType } from '../lexer/types';
import { validateParens } from './validation';
import { NodeType } from '../parser/types';
import { ParserException } from './exceptions';

const nudHandler = (parser: Parser): Node => {
  const { type, nodeType, parseStrategy, value } = parser.getCurrentToken();

  if (parseStrategy !== ParseStrategy.NUD) {
    throw new ParserException(`NUD handler expected for token ${value}`);
  }

  parser.pos++;

  switch (type) {
    case TokenType.NOT:
      const left = handler(parser, BindingPower.DEFAULT);

      return {
        type: nodeType,
        value,
        left,
      };
    case TokenType.OPEN_PAREN:
      validateParens(parser);
      return handler(parser, BindingPower.DEFAULT);
    default:
      return {
        type: nodeType,
        value,
      };
  }
};

const ledHandler = (parser: Parser, left: Node): Node => {
  const current = parser.getCurrentToken();
  const { type, nodeType, value, parseStrategy, bindingPower } = current;

  if (parseStrategy !== ParseStrategy.LED) {
    throw new ParserException(`LED handler expected for token ${value}`);
  }

  parser.pos++;

  const right = handler(parser, bindingPower);

  switch (type) {
    case TokenType.EQ:
    case TokenType.NE:
      if (right.type === NodeType.ARRAY) {
        throw new ParserException(
          `Operator of type ${value} expects one of the following types: ${NodeType.STRING_LITERAL}, ${NodeType.NUMBER_LITERAL}, or ${NodeType.BOOLEAN_LITERAL}. Received ${right.type}.`,
        );
      }

      return {
        type: nodeType,
        value,
        left,
        right,
      };
    case TokenType.GTE:
    case TokenType.GT:
    case TokenType.LT:
    case TokenType.LTE:
      const allowedSet = new Set<NodeType>([NodeType.NUMBER_LITERAL, NodeType.DATE_LITERAL]);
      if (!allowedSet.has(right.type as NodeType)) {
        throw new ParserException(
          `Operator of type ${value} expects ${NodeType.NUMBER_LITERAL} or ${NodeType.DATE_LITERAL}, received ${right.type}`,
        );
      }
      return {
        type: nodeType,
        value,
        left,
        right,
      };
    case TokenType.IN:
      if (right.type !== NodeType.ARRAY) {
        throw new ParserException(
          `Operator of type "${value}" expects ${NodeType.ARRAY}, received ${right.type}`,
        );
      }
      return {
        type: nodeType,
        value,
        left,
        right,
      };
    default:
      return {
        type: nodeType,
        value,
        left,
        right,
      };
  }
};

export const handler = (
  parser: Parser,
  bp: BindingPower = BindingPower.DEFAULT,
): Node => {
  let left = nudHandler(parser);

  if (parser.pos >= parser.tokens.length) {
    return left;
  }

  const { value, bindingPower } = parser.getCurrentToken();
  while (bindingPower > bp && parser.pos < parser.tokens.length) {
    const atEnd = parser.getCurrentToken().type === TokenType.CLOSE_PAREN;

    if (atEnd) {
      parser.pos++;
      break;
    }

    left = ledHandler(parser, left);
  }

  return left;
};
