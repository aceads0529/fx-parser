import {FxParserRule, FxParserRuleResult} from "../fx-parser-rule";
import {FxElement} from "../../fx-element";
import {FxElementRule} from "./fx-element-rule";

export class FxLogicalRule extends FxParserRule {

  public items: FxParserRule[];

  constructor(...items: FxParserRule[]) {
    super();
    this.items = items;
  }

  public parse(elements: FxElement[], index: number, scope: string[]): FxParserRuleResult {
    if (index >= elements.length) {
      return FxParserRuleResult.fail();
    }

    const successfulRules: FxParserRuleResult[] = [];

    for (const item of this.items) {
      if (item instanceof FxElementRule && scope.indexOf(item.symbol) != -1) {
        continue;
      }

      const result = item.parse(elements, index, scope);

      if (result.success) {
        successfulRules.push(result);
      }
    }

    if (successfulRules.length) {
      successfulRules.sort((a, b) => b.offset - a.offset);
      return successfulRules[0];
    } else {
      return FxParserRuleResult.fail();
    }
  }

  protected propagateId(): void {
    this.items.forEach(i => i.id = this.id);
  }
}
