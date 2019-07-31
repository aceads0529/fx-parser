import {FxToken} from "../fx-token";
import {FxElement} from "../fx-element";
import {FxParserRule, FxParserRuleOptions} from "./fx-parser-rule";

export interface FxParserRuleItem {
  rule: FxParserRule,
  options: Partial<FxParserRuleOptions>
}

export interface FxParserRuleResolver {
  getRuleItem(symbol: string): FxParserRuleItem;
}

export abstract class FxParserBase implements FxParserRuleResolver {

  private readonly rules: { [index: string]: FxParserRuleItem };

  private tokens: FxToken[];
  private prevPassed: boolean;

  constructor() {
    this.rules = {};
    this.define();
  }

  public parse(tokens: FxToken[]): FxElement {
    this.tokens = tokens;
    this.prevPassed = null;

    return this.parseRoot();
  }

  private parseRoot(): FxElement {
    const key = Object.keys(this.rules)[0];
    const rule = this.rules[key];

    const root = new FxElement(key);
    const result = this.rules[key].rule.parse(this.tokens, 0, []);

    if (result.success && result.offset == this.tokens.length) {
      root.children.push(...result.elements);
    }

    return root;
  }

  protected abstract define(): void;

  protected rule(symbol: string, rule: FxParserRule, options?: Partial<FxParserRuleOptions>): void {
    this.rules[symbol] = {
      rule: rule,
      options: FxParserBase.mergeWithDefaultOptions(options)
    };
    rule.id = symbol;
  }

  public getRuleItem(symbol: string): FxParserRuleItem {
    const item = this.rules[symbol];
    if (item) {
      return item;
    } else {
      throw new Error("Element <" + symbol + "> does not exist");
    }
  }

  private static mergeWithDefaultOptions(options: Partial<FxParserRuleOptions>): FxParserRuleOptions {
    return Object.assign({
      isPrivate: false
    }, options);
  }
}
