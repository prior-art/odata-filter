import { Parser } from './parser';
import { NodeType, ParseStrategy, BindingPower, AST } from './types';
import { TokenType } from '../tokenizer/types';
import { validateParens } from './validation';

const allowedComparisonValues = new Set<NodeType>();
allowedComparisonValues.add(NodeType.NUMBER_LITERAL);
allowedComparisonValues.add(NodeType.DATE_LITERAL);
allowedComparisonValues.add(NodeType.TIME_LITERAL);
allowedComparisonValues.add(NodeType.DATETIME_LITERAL);
allowedComparisonValues.add(NodeType.DURATION_LITERAL);

function nudHandler(parser: Parser): AST {
  const token = parser.getCurrentToken();

  if (parser.parseStrategy() !== ParseStrategy.NUD) {
    throw new Error(`NUD handler expected for token ${token.value.raw}`);
  }

  const nodeType = parser.nodeType();

  parser.nextToken();

  switch (token.type) {
    case TokenType.NOT: {
      const left = handler(parser, BindingPower.DEFAULT);

      return {
        type: nodeType,
        value: token.value,
        left: left,
      };
    }
    case TokenType.OPEN_PAREN: {
      validateParens(parser);
      return handler(parser, BindingPower.DEFAULT);
    }
    default: {
      return {
        type: nodeType,
        value: token.value,
      };
    }
  }
}

function ledHandler(parser: Parser, left: AST): AST {
  const token = parser.getCurrentToken();

  if (parser.parseStrategy() !== ParseStrategy.LED) {
    throw new Error(`LED handler expected for token ${token.value.raw}`);
  }

  const bindingPower = parser.bindingPower();
  const nodeType = parser.nodeType();

  parser.nextToken();

  const right = handler(parser, bindingPower);

  switch (token.type) {
    case TokenType.EQ:
    case TokenType.NE: {
      if (right.type === NodeType.ARRAY) {
        throw new Error(
          `Operator of type ${token.value.raw} expects one of the following types: ${NodeType.STRING_LITERAL}, ${NodeType.NUMBER_LITERAL}, or ${NodeType.BOOLEAN_LITERAL}. Received ${right.type}.`,
        );
      }

      return {
        type: nodeType,
        value: token.value,
        left: left,
        right: right,
      };
    }

    case TokenType.GTE:
    case TokenType.GT:
    case TokenType.LT:
    case TokenType.LTE: {
      if (!allowedComparisonValues.has(right.type)) {
        throw new Error(
          `Operator of type ${token.value.raw} expects ${NodeType.NUMBER_LITERAL}, received ${right.type}.`,
        );
      }

      return {
        type: nodeType,
        value: token.value,
        left: left,
        right: right,
      };
    }

    case TokenType.IN: {
      if (right.type !== NodeType.ARRAY) {
        throw new Error(
          `Operator of type ${token.value.raw} expects ${NodeType.ARRAY}, received ${right.type}.`,
        );
      }

      return {
        type: nodeType,
        value: token.value,
        left: left,
        right: right,
      };
    }

    default: {
      return {
        type: nodeType,
        value: token.value,
        left: left,
        right: right,
      };
    }
  }
}

export function handler(
  parser: Parser,
  bp: BindingPower = BindingPower.DEFAULT,
): AST {
  let left = nudHandler(parser);

  if (parser.pos >= parser.tokens.length) {
    return left;
  }

  const bindingPower = parser.bindingPower();
  while (bindingPower > bp && parser.pos < parser.tokens.length) {
    const atEnd = parser.getCurrentToken().type === TokenType.CLOSE_PAREN;

    if (atEnd) {
      parser.nextToken();
      break;
    }

    left = ledHandler(parser, left);
  }

  return left;
}
