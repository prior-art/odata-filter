import { TokenType } from '@odata-filter/core';
import { MongoOperators } from './types';

export const mongoOperatorLookup: Record<TokenType, MongoOperators> = {
  [TokenType.AND]: MongoOperators.AND,
  [TokenType.OR]: MongoOperators.OR,
  [TokenType.IN]: MongoOperators.IN,
  [TokenType.EQ]: MongoOperators.EQ,
  [TokenType.NE]: MongoOperators.NE,
  [TokenType.LT]: MongoOperators.LT,
  [TokenType.LTE]: MongoOperators.LTE,
  [TokenType.GT]: MongoOperators.GT,
  [TokenType.GTE]: MongoOperators.GTE,
  [TokenType.NOT]: MongoOperators.NOT,

  [TokenType.WHITESPACE]: MongoOperators.UNKNOWN,
  [TokenType.STRING]: MongoOperators.UNKNOWN,
  [TokenType.SYMBOL]: MongoOperators.UNKNOWN,
  [TokenType.NUMBER]: MongoOperators.UNKNOWN,
  [TokenType.TUPLE]: MongoOperators.UNKNOWN,
  [TokenType.OPEN_PAREN]: MongoOperators.UNKNOWN,
  [TokenType.CLOSE_PAREN]: MongoOperators.UNKNOWN,
  [TokenType.TRUE]: MongoOperators.UNKNOWN,
  [TokenType.FALSE]: MongoOperators.UNKNOWN,
  [TokenType.NULL]: MongoOperators.UNKNOWN,
  [TokenType.DATE]: MongoOperators.UNKNOWN,
  [TokenType.DATETIME]: MongoOperators.UNKNOWN,
  [TokenType.TIME]: MongoOperators.UNKNOWN,
  [TokenType.DURATION]: MongoOperators.UNKNOWN,
  [TokenType.GUID]: MongoOperators.UNKNOWN,
};
