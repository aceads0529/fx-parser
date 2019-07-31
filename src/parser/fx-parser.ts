import {FxParserBase, FxParserRuleItem, FxParserRuleResolver} from "./fx-parser-base";
import {FxParserRuleBuilder} from "./fx-parser-rule-builder";
import {FxParserRuleOptions} from "./fx-parser-rule";
import {FxToken} from "../fx-token";
import {FxElement} from "../fx-element";

export abstract class FxParser implements FxParserRuleResolver {

  private readonly rules: { [index: string]: FxParserRuleItem };
  private readonly ruleBuilder: FxParserRuleBuilder;

  private tokens: FxToken[];
  private prevPassed: boolean;

  constructor() {
    this.ruleBuilder = new FxParserRuleBuilder(this);
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

    if (result.elements) {
      root.children.push(...result.elements);
    }

    return root;
  }

  protected abstract define(): void;

  protected rule(symbol: string, expr: string, options?: FxParserRuleOptions): void {
    this.rules[symbol] = {
      rule: this.ruleBuilder.build(symbol, expr),
      options: FxParser.mergeWithDefaultOptions(options)
    };
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
