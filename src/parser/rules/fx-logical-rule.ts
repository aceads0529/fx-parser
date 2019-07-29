import {FxParserRule, FxParserRuleResult} from "../fx-parser-rule";
import {FxElement} from "../../fx-element";
import {FxElementRule} from "./fx-element-rule";

export class FxLogicalRule implements FxParserRule {

  public items: FxParserRule[];

  constructor(...items: FxParserRule[]) {
    this.items = items;
  }

  public parse(elements: FxElement[], index: number, scope: string[]): FxParserRuleResult {
    if (index >= elements.length) {
      return FxParserRuleResult.fail();
    }

    for (const item of this.items) {
      // if (item instanceof FxElementRule && scope.indexOf(item.symbol) != -1) {
      //   continue;
      // }

      const result = item.parse(elements, index, scope);
      if (result.success) {
        return result;
      }
    }

    return FxParserRuleResult.fail();
  }
}
