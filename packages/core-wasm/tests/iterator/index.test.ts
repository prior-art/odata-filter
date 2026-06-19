import { test, expect } from "assemblyscript-unittest-framework/assembly";
import * as app from "../../assembly/index";

test('it transforms the abstract syntax tree (AST) into an Array collection of nodes', () => {
  const tokens = app.tokenize("true eq true and false ne false");
  const ast = app.parse(tokens);

  const result = app.iterate(ast);

  expect(result.length).equal(7);
  expect(result[0].type).equal(app.NodeType.LOGICAL_OPERATOR);
  expect(result[0].value.stringValue).equal("and");
  expect(result[1].type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(result[1].value.stringValue).equal("eq");
  expect(result[2].type).equal(app.NodeType.BOOLEAN_LITERAL);
  expect(result[2].value.boolValue).equal(true);
  expect(result[3].type).equal(app.NodeType.BOOLEAN_LITERAL);
  expect(result[3].value.boolValue).equal(true);
  expect(result[4].type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(result[4].value.stringValue).equal("ne");
  expect(result[5].type).equal(app.NodeType.BOOLEAN_LITERAL);
  expect(result[5].value.boolValue).equal(false);
  expect(result[6].type).equal(app.NodeType.BOOLEAN_LITERAL);
  expect(result[6].value.boolValue).equal(false);
});
