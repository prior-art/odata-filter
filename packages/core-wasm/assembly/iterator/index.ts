import { AST } from '../parser/types';

function recurse(ast: AST | null, iterable: Array<AST> = []): Array<AST> {
  if (ast) {
    iterable.push(ast);
  }

  if (ast && ast.left) {
    recurse(ast.left, iterable);
  }
  if (ast && ast.right) {
    recurse(ast.right, iterable);
  }

  return iterable;
};

export function iterate(ast: AST): Array<AST> {
  return recurse(ast);
};
