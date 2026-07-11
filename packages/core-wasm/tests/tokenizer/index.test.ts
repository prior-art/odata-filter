import { test, expect } from "assemblyscript-unittest-framework/assembly";
import * as app from "../../assembly/index";

test("should tokenize empty string", () => {
  const actual = app.tokenize("");
  expect(actual.length).equal(0);
});

test("should tokenize whitespace only", () => {
  const actual = app.tokenize("     ");
  expect(actual.length).equal(1);
  expect(actual[0].type).equal(app.TokenType.WHITESPACE);
  expect(actual[0].value.raw).equal("     ");
  expect(actual[0].value.stringValue).equal("     ");
  expect(actual[0].position).equal(0);
});

test("should tokenize single symbol", () => {
  const actual = app.tokenize("country");
  expect(actual.length).equal(1);
  expect(actual[0].type).equal(app.TokenType.SYMBOL);
  expect(actual[0].value.raw).equal("country");
  expect(actual[0].value.stringValue).equal("country");
});

test("should tokenize single number", () => {
  const actual = app.tokenize("12345");
  expect(actual.length).equal(1);
  expect(actual[0].type).equal(app.TokenType.NUMBER);
  expect(actual[0].value.raw).equal("12345");
  expect(actual[0].value.intValue).equal(12345);
});

test("should tokenize single string", () => {
  const actual = app.tokenize("'Hello World'");
  expect(actual.length).equal(1);
  expect(actual[0].type).equal(app.TokenType.STRING);
  expect(actual[0].value.raw).equal("'Hello World'");
  expect(actual[0].value.stringValue).equal("Hello World");
});

test("should tokenize single boolean", () => {
  const actual = app.tokenize("true");
  expect(actual.length).equal(1);
  expect(actual[0].type).equal(app.TokenType.BOOLEAN);
  expect(actual[0].value.raw).equal("true");
  expect(actual[0].value.boolValue).equal(true);
});

test("should tokenize single null", () => {
  const actual = app.tokenize("null");
  expect(actual.length).equal(1);
  expect(actual[0].type).equal(app.TokenType.NULL);
  expect(actual[0].value.raw).equal("null");
});

test("should tokenize single operator", () => {
  const actual = app.tokenize("eq");
  expect(actual.length).equal(1);
  expect(actual[0].type).equal(app.TokenType.EQ);
  expect(actual[0].value.raw).equal("eq");
});

test("should tokenize single tuple", () => {
  const actual = app.tokenize("('USA', 'CAN', 'MEX')");
  expect(actual.length).equal(1);
  expect(actual[0].type).equal(app.TokenType.TUPLE);
  expect(actual[0].value.raw).equal("('USA', 'CAN', 'MEX')");
  expect(actual[0].value.arrayValue.length).equal(3);
  expect(actual[0].value.arrayValue[0].stringValue).equal("USA");
  expect(actual[0].value.arrayValue[1].stringValue).equal("CAN");
  expect(actual[0].value.arrayValue[2].stringValue).equal("MEX");
});

test("should tokenize single open parenthesis", () => {
  const actual = app.tokenize("(");
  expect(actual.length).equal(1);
  expect(actual[0].type).equal(app.TokenType.OPEN_PAREN);
  expect(actual[0].value.raw).equal("(");
});

test("should tokenize single close parenthesis", () => {
  const actual = app.tokenize(")");
  expect(actual.length).equal(1);
  expect(actual[0].type).equal(app.TokenType.CLOSE_PAREN);
  expect(actual[0].value.raw).equal(")");
});

test("should tokenize complex expression", () => {
  const actual = app.tokenize("(country eq 'USA' and age gt 21)");
  expect(actual.length).equal(15);
  expect(actual[0].type).equal(app.TokenType.OPEN_PAREN);
  expect(actual[0].value.raw).equal("(");
  expect(actual[1].type).equal(app.TokenType.SYMBOL);
  expect(actual[1].value.raw).equal("country");
  expect(actual[2].type).equal(app.TokenType.WHITESPACE);
  expect(actual[3].value.raw).equal("eq");
  expect(actual[3].type).equal(app.TokenType.EQ);
  expect(actual[4].value.raw).equal(" ");
  expect(actual[4].type).equal(app.TokenType.WHITESPACE);
  expect(actual[5].value.raw).equal("'USA'");
  expect(actual[5].type).equal(app.TokenType.STRING);
  expect(actual[6].value.raw).equal(" ");
  expect(actual[6].type).equal(app.TokenType.WHITESPACE);
  expect(actual[7].value.raw).equal("and");
  expect(actual[7].type).equal(app.TokenType.AND);
  expect(actual[8].value.raw).equal(" ");
  expect(actual[8].type).equal(app.TokenType.WHITESPACE);
  expect(actual[9].value.raw).equal("age");
  expect(actual[9].type).equal(app.TokenType.SYMBOL);
  expect(actual[10].value.raw).equal(" ");
  expect(actual[10].type).equal(app.TokenType.WHITESPACE);
  expect(actual[11].value.raw).equal("gt");
  expect(actual[11].type).equal(app.TokenType.GT);
  expect(actual[12].value.raw).equal(" ");
  expect(actual[12].type).equal(app.TokenType.WHITESPACE);
  expect(actual[13].value.raw).equal("21");
  expect(actual[13].type).equal(app.TokenType.NUMBER);
  expect(actual[14].value.raw).equal(")");
  expect(actual[14].type).equal(app.TokenType.CLOSE_PAREN);
});

test("should tokenize signed numbers", () => {
  const actual = app.tokenize("rate gte -123");
  expect(actual.length).equal(5);
  expect(actual[0].type).equal(app.TokenType.SYMBOL);
  expect(actual[0].value.raw).equal("rate");
  expect(actual[1].type).equal(app.TokenType.WHITESPACE);
  expect(actual[1].value.raw).equal(" ");
  expect(actual[2].type).equal(app.TokenType.GTE);
  expect(actual[2].value.raw).equal("gte");
  expect(actual[3].type).equal(app.TokenType.WHITESPACE);
  expect(actual[3].value.raw).equal(" ");
  expect(actual[4].type).equal(app.TokenType.NUMBER);
  expect(actual[4].value.raw).equal("-123");
  expect(actual[4].value.intValue).equal(-123);
});

test("should tokenize decimal numbers", () => {
  const actual = app.tokenize("price lt 19.99");
  expect(actual.length).equal(5);
  expect(actual[0].type).equal(app.TokenType.SYMBOL);
  expect(actual[0].value.raw).equal("price");
  expect(actual[1].type).equal(app.TokenType.WHITESPACE);
  expect(actual[1].value.raw).equal(" ");
  expect(actual[2].type).equal(app.TokenType.LT);
  expect(actual[2].value.raw).equal("lt");
  expect(actual[3].type).equal(app.TokenType.WHITESPACE);
  expect(actual[3].value.raw).equal(" ");
  expect(actual[4].type).equal(app.TokenType.NUMBER);
  expect(actual[4].value.raw).equal("19.99");
  expect(actual[4].value.floatValue).equal(19.99);
});

test("should tokenize scientific notation numbers", () => {
  const actual = app.tokenize("value eq 1.23e4");
  expect(actual.length).equal(5);
  expect(actual[0].type).equal(app.TokenType.SYMBOL);
  expect(actual[0].value.raw).equal("value");
  expect(actual[1].type).equal(app.TokenType.WHITESPACE);
  expect(actual[1].value.raw).equal(" ");
  expect(actual[2].type).equal(app.TokenType.EQ);
  expect(actual[2].value.raw).equal("eq");
  expect(actual[3].type).equal(app.TokenType.WHITESPACE);
  expect(actual[3].value.raw).equal(" ");
  expect(actual[4].type).equal(app.TokenType.NUMBER);
  expect(actual[4].value.raw).equal("1.23e4");
  expect(actual[4].value.intValue).equal(12300);
});

test("should tokenize scientific notation numbers with negative exponent", () => {
  const actual = app.tokenize("value eq 5.67E-8");
  expect(actual.length).equal(5);
  expect(actual[0].type).equal(app.TokenType.SYMBOL);
  expect(actual[0].value.raw).equal("value");
  expect(actual[1].type).equal(app.TokenType.WHITESPACE);
  expect(actual[1].value.raw).equal(" ");
  expect(actual[2].type).equal(app.TokenType.EQ);
  expect(actual[2].value.raw).equal("eq");
  expect(actual[3].type).equal(app.TokenType.WHITESPACE);
  expect(actual[3].value.raw).equal(" ");
  expect(actual[4].type).equal(app.TokenType.NUMBER);
  expect(actual[4].value.raw).equal("5.67E-8");
  expect(actual[4].value.floatValue).equal(5.67e-8);
});

test("should tokenize numbers with explicit positive sign", () => {
  const actual = app.tokenize("value eq +42");
  expect(actual.length).equal(5);
  expect(actual[0].type).equal(app.TokenType.SYMBOL);
  expect(actual[0].value.raw).equal("value");
  expect(actual[1].type).equal(app.TokenType.WHITESPACE);
  expect(actual[1].value.raw).equal(" ");
  expect(actual[2].type).equal(app.TokenType.EQ);
  expect(actual[2].value.raw).equal("eq");
  expect(actual[3].type).equal(app.TokenType.WHITESPACE);
  expect(actual[3].value.raw).equal(" ");
  expect(actual[4].type).equal(app.TokenType.NUMBER);
  expect(actual[4].value.raw).equal("+42");
  expect(actual[4].value.intValue).equal(42);
});

test("should tokenize date values", () => {
  const actual = app.tokenize("date eq 2023-06-15");
  expect(actual.length).equal(5);
  expect(actual[0].type).equal(app.TokenType.SYMBOL);
  expect(actual[0].value.raw).equal("date");
  expect(actual[1].type).equal(app.TokenType.WHITESPACE);
  expect(actual[1].value.raw).equal(" ");
  expect(actual[2].type).equal(app.TokenType.EQ);
  expect(actual[2].value.raw).equal("eq");
  expect(actual[3].type).equal(app.TokenType.WHITESPACE);
  expect(actual[3].value.raw).equal(" ");
  expect(actual[4].type).equal(app.TokenType.DATE);
  expect(actual[4].value.raw).equal("2023-06-15");
  expect(actual[4].value.stringValue).equal("2023-06-15");
});

test("should tokenize datetime values", () => {
  const actual = app.tokenize("datetime eq 2023-06-15T12:34:56Z");
  expect(actual.length).equal(5);
  expect(actual[0].type).equal(app.TokenType.SYMBOL);
  expect(actual[0].value.raw).equal("datetime");
  expect(actual[1].type).equal(app.TokenType.WHITESPACE);
  expect(actual[1].value.raw).equal(" ");
  expect(actual[2].type).equal(app.TokenType.EQ);
  expect(actual[2].value.raw).equal("eq");
  expect(actual[3].type).equal(app.TokenType.WHITESPACE);
  expect(actual[3].value.raw).equal(" ");
  expect(actual[4].type).equal(app.TokenType.DATETIME);
  expect(actual[4].value.raw).equal("2023-06-15T12:34:56Z");
  expect(actual[4].value.stringValue).equal("2023-06-15T12:34:56Z");
});

test("should tokenize time values", () => {
  const actual = app.tokenize("time eq 12:34:56");
  expect(actual.length).equal(5);
  expect(actual[0].type).equal(app.TokenType.SYMBOL);
  expect(actual[0].value.raw).equal("time");
  expect(actual[1].type).equal(app.TokenType.WHITESPACE);
  expect(actual[1].value.raw).equal(" ");
  expect(actual[2].type).equal(app.TokenType.EQ);
  expect(actual[2].value.raw).equal("eq");
  expect(actual[3].type).equal(app.TokenType.WHITESPACE);
  expect(actual[3].value.raw).equal(" ");
  expect(actual[4].type).equal(app.TokenType.TIME);
  expect(actual[4].value.raw).equal("12:34:56");
  expect(actual[4].value.stringValue).equal("12:34:56");
});

test("should tokenize duration values", () => {
  const actual = app.tokenize("duration eq P1Y2M3DT4H5M6S");
  expect(actual.length).equal(5);
  expect(actual[0].type).equal(app.TokenType.SYMBOL);
  expect(actual[0].value.raw).equal("duration");
  expect(actual[1].type).equal(app.TokenType.WHITESPACE);
  expect(actual[1].value.raw).equal(" ");
  expect(actual[2].type).equal(app.TokenType.EQ);
  expect(actual[2].value.raw).equal("eq");
  expect(actual[3].type).equal(app.TokenType.WHITESPACE);
  expect(actual[3].value.raw).equal(" ");
  expect(actual[4].type).equal(app.TokenType.DURATION);
  expect(actual[4].value.raw).equal("P1Y2M3DT4H5M6S");
  expect(actual[4].value.stringValue).equal("P1Y2M3DT4H5M6S");
});

test("should tokenize time-based duration values", () => {
  const actual = app.tokenize("duration eq PT4H5M6S");
  expect(actual.length).equal(5);
  expect(actual[0].type).equal(app.TokenType.SYMBOL);
  expect(actual[0].value.raw).equal("duration");
  expect(actual[1].type).equal(app.TokenType.WHITESPACE);
  expect(actual[1].value.raw).equal(" ");
  expect(actual[2].type).equal(app.TokenType.EQ);
  expect(actual[2].value.raw).equal("eq");
  expect(actual[3].type).equal(app.TokenType.WHITESPACE);
  expect(actual[3].value.raw).equal(" ");
  expect(actual[4].type).equal(app.TokenType.DURATION);
  expect(actual[4].value.raw).equal("PT4H5M6S");
  expect(actual[4].value.stringValue).equal("PT4H5M6S");
});

test("should tokenize time-based duration values with only seconds", () => {
  const actual = app.tokenize("duration eq PT6.002S");
  expect(actual.length).equal(5);
  expect(actual[0].type).equal(app.TokenType.SYMBOL);
  expect(actual[0].value.raw).equal("duration");
  expect(actual[1].type).equal(app.TokenType.WHITESPACE);
  expect(actual[1].value.raw).equal(" ");
  expect(actual[2].type).equal(app.TokenType.EQ);
  expect(actual[2].value.raw).equal("eq");
  expect(actual[3].type).equal(app.TokenType.WHITESPACE);
  expect(actual[3].value.raw).equal(" ");
  expect(actual[4].type).equal(app.TokenType.DURATION);
  expect(actual[4].value.raw).equal("PT6.002S");
  expect(actual[4].value.stringValue).equal("PT6.002S");
});

test("should not tokenize symbols starting with P as durations", () => {
  const actual = app.tokenize("Price eq 1");
  expect(actual.length).equal(5);
  expect(actual[0].type).equal(app.TokenType.SYMBOL);
  expect(actual[0].value.raw).equal("Price");
});
