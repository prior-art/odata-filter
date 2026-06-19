import { test, expect } from "assemblyscript-unittest-framework/assembly";
import * as app from "../../assembly/index";

test('should export parse function', () => {
  const ast = app.parse([]);

  expect(ast.type).equal(app.NodeType.DEFAULT);
  expect(ast.value.format).equal(app.TokenFormat.STRING);
  expect(ast.value.raw).equal("");
  expect(ast.value.intValue).equal(0);
  expect(ast.value.boolValue).equal(false);
  expect(ast.value.floatValue).equal(0);
  expect(ast.value.stringValue).equal("");
  expect(ast.value.arrayValue.length).equal(0);
  expect(ast.left).isNull();
  expect(ast.right).isNull();
});
