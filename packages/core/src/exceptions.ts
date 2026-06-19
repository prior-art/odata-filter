export class FilterQueryParserException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'FilterQueryParserException';
    Object.setPrototypeOf(this, FilterQueryParserException.prototype);
  }
}
