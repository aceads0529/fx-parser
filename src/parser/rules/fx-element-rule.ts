import {FxParserRule, FxParserRuleOptions, FxParserRuleResult} from "../fx-parser-rule";
import {FxElement} from "../../fx-element";
import {FxParserRuleResolver} from "../fx-parser-base";

export class FxElementRule implements FxParserRule {

  public symbol: string;
  public resolver: FxParserRuleResolver;

  constructor(symbol: string, resolver: FxParserRuleResolver) {
    this.symbol = symbol;
    this.resolver = resolver;
  }

  public parse(elements: FxElement[], index: number, scope: string[]): FxParserRuleResult {
    const item = this.resolver.getRuleItem(this.symbol);

    // if (scope.indexOf(this.symbol) == -1) {
      scope.push(this.symbol);
      const result = item.rule.parse(elements, index, scope);
      scope.pop();

      if (result.success && !item.options.isPrivate) {
        const wrapper = new FxElement(this.symbol);
        wrapper.children.push(...result.elements);
        return new FxParserRuleResult(result.offset, wrapper);
      } else {
        return result;
      }
    // } else {
    //   return FxParserRuleResult.fail();
    // }
  }
}
