import {FxToken} from "../fx-token";
import {FxElement} from "../fx-element";
import {FxParserItem, FxParserRule} from "./fx-parser-rule";

export abstract class FxParser {

  private readonly rules: { [index: string]: FxParserRule };

  private tokens: FxToken[];

  constructor() {
    this.rules = {};
    this.define();
  }

  public parse(tokens: FxToken[]) {
    this.tokens = tokens;

    const rule = this.getFirstRule();

    const offset = this.testRule(rule, 0);
    if (offset > 0) {
      console.log("Test passed");
    }

    return new FxElement("root");
  }

  private getFirstRule() {
    return this.rules[Object.keys(this.rules)[0]];
  }

  private testRule(rule: FxParserRule, index: number) {
    let offset = 0;
    let prevFailed = false;

    rule.reset();
    let next = rule.next(prevFailed);

    while (typeof next != "boolean") {
      const nextOffset = this.testRuleItem(next, index);
      prevFailed = nextOffset == 0;
      offset += nextOffset;

      next = rule.next(prevFailed);
    }

    if (next == true) {
      return offset;
    } else {
      return 0;
    }
  }

  protected abstract define(): void;

  protected rule(symbol: string, rule: FxParserRule) {
    this.rules[symbol] = rule;
  }

  private testRuleItem(ruleItem: FxParserItem, index: number) {
    if (ruleItem.isTerminal) {
      return this.tokens[index].tag == ruleItem.symbol ? 1 : 0;
    } else {
      const rule = this.rules[ruleItem.symbol];
      return this.testRule(rule, index);
    }
  }
}