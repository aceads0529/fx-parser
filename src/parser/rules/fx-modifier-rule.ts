import {FxParserRule, FxParserRuleResult} from "../fx-parser-rule";
import {FxElement} from "../../fx-element";

type FxModifier = "*" | "?" | "+";

export class FxModifierRule extends FxParserRule {

  public modifier: FxModifier;
  public rule: FxParserRule;

  constructor(modifier: FxModifier, rule: FxParserRule) {
    super();
    this.modifier = modifier;
    this.rule = rule;
  }

  public parse(elements: FxElement[], index: number, scope: string[]): FxParserRuleResult {
    const result = new FxParserRuleResult();
    let keepParsing: boolean;

    if (index >= elements.length) {
      return this.modifier == "*" || this.modifier == "?" ? result : FxParserRuleResult.fail();
    }

    do {
      const ruleResult = this.rule.parse(elements, index + result.offset, scope);
      if (ruleResult.success) {
        result.elements.push(...ruleResult.elements);
        result.offset += ruleResult.offset;
        keepParsing = this.modifier == "*" || this.modifier == "+";
      } else {
        keepParsing = false;
      }
    } while (keepParsing);

    switch (this.modifier) {
      case "*":
      case "?":
        return result;
      case "+":
        return result.offset > 0 ? result : FxParserRuleResult.fail();
    }
  }

  protected propagateId(): void {
    this.rule.id = this.id;
  }
}
