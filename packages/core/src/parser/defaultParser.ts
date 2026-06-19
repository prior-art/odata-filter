import { Parser } from './types';
import {
  nodeTypeLookup,
  bindingPowerLookup,
  parseStrategyLookup,
} from './lookups';
import { ParserException } from './exceptions';

const defaultParser: Parser = {
  pos: 0,
  tokens: [],
  getCurrentToken: function () {
    if (this.pos >= this.tokens.length) {
      throw new ParserException('Token range exceeded.');
    }

    const current = this.tokens[this.pos];

    return {
      ...current,
      nodeType: nodeTypeLookup[current.type],
      parseStrategy: parseStrategyLookup[current.type],
      bindingPower: bindingPowerLookup[current.type],
    };
  },
};

export default defaultParser;
