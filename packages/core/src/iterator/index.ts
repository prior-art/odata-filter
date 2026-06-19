import { Node } from '../parser/types';

export const iterate = (ast: Node): Node[] => {
  let iterable: Node[] = [];

  const recurse = (ast: Node): void => {
    iterable.push(ast);

    if (ast.left) recurse(ast.left);
    if (ast.right) recurse(ast.right);
  };

  recurse(ast);

  return iterable;
};
