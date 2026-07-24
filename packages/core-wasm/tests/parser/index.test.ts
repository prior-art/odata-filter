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

test('should parse a simple expression', () => {
  const tokens = app.tokenize("price gt 100");
  const ast = app.parse(tokens);

  expect(ast.type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(ast.value.raw).equal("gt");
  expect(ast.left).not.isNull();
  expect(ast.left!.type).equal(app.NodeType.FIELD);
  expect(ast.left!.value.raw).equal("price");
  expect(ast.right).not.isNull();
  expect(ast.right!.type).equal(app.NodeType.NUMBER_LITERAL);
  expect(ast.right!.value.raw).equal("100");
});

test('should parse a logical expression', () => {
  const tokens = app.tokenize("price gt 100 and category eq 'electronics'");
  const ast = app.parse(tokens);

  expect(ast.type).equal(app.NodeType.LOGICAL_OPERATOR);
  expect(ast.value.raw).equal("and");
  expect(ast.left).not.isNull();
  expect(ast.left!.type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(ast.left!.value.raw).equal("gt");
  expect(ast.left!.left).not.isNull();
  expect(ast.left!.left!.type).equal(app.NodeType.FIELD);
  expect(ast.left!.left!.value.raw).equal("price");
  expect(ast.left!.right).not.isNull();
  expect(ast.left!.right!.type).equal(app.NodeType.NUMBER_LITERAL);
  expect(ast.left!.right!.value.raw).equal("100");

  expect(ast.right).not.isNull();
  expect(ast.right!.type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(ast.right!.value.raw).equal("eq");
  expect(ast.right!.left).not.isNull();
  expect(ast.right!.left!.type).equal(app.NodeType.FIELD);
  expect(ast.right!.left!.value.raw).equal("category");
  expect(ast.right!.right).not.isNull();
  expect(ast.right!.right!.type).equal(app.NodeType.STRING_LITERAL);
  expect(ast.right!.right!.value.raw).equal("'electronics'");
});

test('should parse a datetime value', () => {
  const tokens = app.tokenize("createdAt gt 2023-01-01T00:00:00Z");
  const ast = app.parse(tokens);

  expect(ast.type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(ast.value.raw).equal("gt");
  expect(ast.left).not.isNull();
  expect(ast.left!.type).equal(app.NodeType.FIELD);
  expect(ast.left!.value.raw).equal("createdAt");
  expect(ast.right).not.isNull();
  expect(ast.right!.type).equal(app.NodeType.DATETIME_LITERAL);
  expect(ast.right!.value.raw).equal("2023-01-01T00:00:00Z");
});

test('should parse a duration value', () => {
  const tokens = app.tokenize("duration lt P5M");
  const ast = app.parse(tokens);

  expect(ast.type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(ast.value.raw).equal("lt");
  expect(ast.left).not.isNull();
  expect(ast.left!.type).equal(app.NodeType.FIELD);
  expect(ast.left!.value.raw).equal("duration");
  expect(ast.right).not.isNull();
  expect(ast.right!.type).equal(app.NodeType.DURATION_LITERAL);
  expect(ast.right!.value.raw).equal("P5M");
});

test('should parse a date value', () => {
  const tokens = app.tokenize("startDate eq 2023-01-01");
  const ast = app.parse(tokens);

  expect(ast.type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(ast.value.raw).equal("eq");
  expect(ast.left).not.isNull();
  expect(ast.left!.type).equal(app.NodeType.FIELD);
  expect(ast.left!.value.raw).equal("startDate");
  expect(ast.right).not.isNull();
  expect(ast.right!.type).equal(app.NodeType.DATE_LITERAL);
  expect(ast.right!.value.raw).equal("2023-01-01");
});

test('should parse a time value', () => {
  const tokens = app.tokenize("startTime eq 12:00:00");
  const ast = app.parse(tokens);

  expect(ast.type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(ast.value.raw).equal("eq");
  expect(ast.left).not.isNull();
  expect(ast.left!.type).equal(app.NodeType.FIELD);
  expect(ast.left!.value.raw).equal("startTime");
  expect(ast.right).not.isNull();
  expect(ast.right!.type).equal(app.NodeType.TIME_LITERAL);
  expect(ast.right!.value.raw).equal("12:00:00");
});

test('should parse a null value', () => {
  const tokens = app.tokenize("deletedAt eq null");
  const ast = app.parse(tokens);

  expect(ast.type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(ast.value.raw).equal("eq");
  expect(ast.left).not.isNull();
  expect(ast.left!.type).equal(app.NodeType.FIELD);
  expect(ast.left!.value.raw).equal("deletedAt");
  expect(ast.right).not.isNull();
  expect(ast.right!.type).equal(app.NodeType.NULL);
  expect(ast.right!.value.raw).equal("null");
});

test('should parse an array value', () => {
  const tokens = app.tokenize("tags in ('electronics', 'gadgets')");
  const ast = app.parse(tokens);

  expect(ast.type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(ast.value.raw).equal("in");
  expect(ast.left).not.isNull();
  expect(ast.left!.type).equal(app.NodeType.FIELD);
  expect(ast.left!.value.raw).equal("tags");
  expect(ast.right).not.isNull();
  expect(ast.right!.type).equal(app.NodeType.ARRAY);
  expect(ast.right!.value.raw).equal("('electronics', 'gadgets')");
  expect(ast.right!.value.arrayValue.length).equal(2);
});

test('should parse a NOT expression', () => {
  const tokens = app.tokenize("not (price gt 100)");
  const ast = app.parse(tokens);

  expect(ast.type).equal(app.NodeType.UNARY_OPERATOR);
  expect(ast.value.raw).equal("not");
  expect(ast.left).not.isNull();
  expect(ast.left!.type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(ast.left!.value.raw).equal("gt");
  expect(ast.right).isNull();
});

test('should parse a complex expression', () => {
  const tokens = app.tokenize("not (price gt 100 and category eq 'electronics') or stock lt 50");
  const ast = app.parse(tokens);

  expect(ast.type).equal(app.NodeType.UNARY_OPERATOR);
  expect(ast.value.raw).equal("not");

  expect(ast.left).not.isNull();
  expect(ast.left!.type).equal(app.NodeType.LOGICAL_OPERATOR);
  expect(ast.left!.value.raw).equal("or");

  expect(ast.left!.right).not.isNull();
  expect(ast.left!.right!.type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(ast.left!.right!.value.raw).equal("lt");
  expect(ast.left!.right!.left).not.isNull();
  expect(ast.left!.right!.left!.type).equal(app.NodeType.FIELD);
  expect(ast.left!.right!.left!.value.raw).equal("stock");
  expect(ast.left!.right!.right).not.isNull();
  expect(ast.left!.right!.right!.type).equal(app.NodeType.NUMBER_LITERAL);
  expect(ast.left!.right!.right!.value.raw).equal("50");

  expect(ast.left!.left).not.isNull();
  expect(ast.left!.left!.type).equal(app.NodeType.LOGICAL_OPERATOR);
  expect(ast.left!.left!.value.raw).equal("and");

  expect(ast.right).isNull();
});

test('should parse an expression containing a guid', () => {
  const tokens = app.tokenize("userId eq 123e4567-e89b-12d3-a456-426614174000");
  const ast = app.parse(tokens);

  expect(ast.type).equal(app.NodeType.COMPARISON_OPERATOR);
  expect(ast.value.raw).equal("eq");
  expect(ast.left).not.isNull();
  expect(ast.left!.type).equal(app.NodeType.FIELD);
  expect(ast.left!.value.raw).equal("userId");
  expect(ast.right).not.isNull();
  expect(ast.right!.type).equal(app.NodeType.STRING_LITERAL);
  expect(ast.right!.value.raw).equal("123e4567-e89b-12d3-a456-426614174000");
});
