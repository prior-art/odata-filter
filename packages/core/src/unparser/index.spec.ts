import { NodeType } from '../parser/types';
import { unparse, tokenize, parse } from '..';

describe('unparser', () => {
  it.each([
    "(country eq 'US' and age gte 21)",
    "(country eq 'Canada' or age lt 18)",
    //"(country eq 'US' and (age gte 21 or age lt 18))",
    //"(country eq 'Canada' or country eq 'Mexico') and age gte 21",
    "not (country eq 'US' and age gte 21)",
    "country in ('US', 'Canada', 'Mexico')",
    "not age in (18, 19, 20)",
    //"isActive eq true and (country eq 'US' or country eq 'Canada')",
    //"name ne null and (age gt 18 or isActive eq true)",
    //"not isActive eq false and (country eq 'US' or country eq 'Canada')",
  ])('it unparses %s', (filter) => {
    const ast = parse(tokenize(filter));
    const result = unparse(ast);
    expect(result).toEqual(filter);
  });

  test('throws an error for unknown AST node types', () => {
    const ast = {
      type: NodeType.DEFAULT,
      value: 'some_value',
    };

    const result = () => unparse(ast);

    expect(result).toThrow('Unknown AST node type: default');
  });
});
