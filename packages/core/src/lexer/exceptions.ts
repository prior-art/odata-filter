import { FilterQueryParserException } from '../exceptions';

export class LexerException extends FilterQueryParserException {
  constructor(message?: string) {
    super(message);
    this.name = 'LexerException';
    Object.setPrototypeOf(this, LexerException.prototype);
  }
}
