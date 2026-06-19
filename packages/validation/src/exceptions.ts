import { FilterQueryParserException } from '@odata-filter/core';

export class ValidationException extends FilterQueryParserException {
  constructor(message?: string) {
    super(message);
    this.name = 'ValidationException';
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}
