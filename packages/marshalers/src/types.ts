export enum MongoOperators {
  AND = '$and',
  OR = '$or',
  IN = '$in',
  EQ = '$eq',
  NE = '$ne',
  LT = '$lt',
  LTE = '$lte',
  GT = '$gt',
  GTE = '$gte',
  NOT = '$not',
  CONTAINS = '$regex',
  UNKNOWN = 'unknown',
}

export enum SqlOperators {
  AND = 'AND',
  OR = 'OR',
  IN = 'IN',
  EQ = '=',
  NE = '!=',
  LT = '<',
  LTE = '<=',
  GT = '>',
  GTE = '>=',
  NOT = 'NOT',
  CONTAINS = 'LIKE',
  UNKNOWN = 'unknown',
}
