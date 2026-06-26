import { Node, NodeType } from '../parser/types';

export const unparse = (ast: Node): string => {
  switch (ast.type) {
    case NodeType.LOGICAL_OPERATOR:
      return `(${unparse(ast.left!)} ${ast.value} ${unparse(ast.right!)})`;
    case NodeType.COMPARISON_OPERATOR:
      return `${unparse(ast.left!)} ${ast.value} ${unparse(ast.right!)}`;
    case NodeType.FIELD:
    case NodeType.NULL:
      return ast.value as string;
    case NodeType.STRING_LITERAL:
      return `'${ast.value as string}'`;
    case NodeType.BOOLEAN_LITERAL:
    case NodeType.NUMBER_LITERAL:
      return (ast.value as string).toString();
    case NodeType.UNARY_OPERATOR:
      return `${ast.value} ${unparse(ast.left!)}`;
    case NodeType.ARRAY:
      return `(${(ast.value as [])
               .map((item) => typeof item == "string" ? `'${item}'` : item)
               .join(', ')})`;
    case NodeType.DEFAULT:
    default:
      throw new Error(`Unknown AST node type: ${ast.type}`);
  }
}
