import {FxParserRule, FxParserRuleOptions, FxParserRuleResult} from "../fx-parser-rule";
import {FxElement} from "../../fx-element";
import {FxParserRuleResolver} from "../fx-parser-base";

export class FxElementRule extends FxParserRule {

  public symbol: string;
  public resolver: FxParserRuleResolver;

  constructor(symbol: string, resolver: FxParserRuleResolver) {
    super();
    this.symbol = symbol;
    this.resolver = resolver;
  }

  public parse(elements: FxElement[], index: number, scope: string[]): FxParserRuleResult {
    const item = this.resolver.getRuleItem(this.symbol);
    const result = item.rule.parse(elements, index, scope);

    if (result.success && !item.options.isPrivate) {
      const wrapper = new FxElement(this.symbol);
      wrapper.children.push(...result.elements);
      return new FxParserRuleResult(result.offset, wrapper);
    } else {
      return result;
    }
  }
}
