import { FilterQueryParserException } from '../exceptions';

export class ParserException extends FilterQueryParserException {
  constructor(message?: string) {
    super(message);
    this.name = 'ParserException';
    Object.setPrototypeOf(this, ParserException.prototype);
  }
}
