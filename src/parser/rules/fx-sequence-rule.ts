import {FxParserRule, FxParserRuleResult} from "../fx-parser-rule";
import {FxElement} from "../../fx-element";

export class FxSequenceRule implements FxParserRule {

  public items: FxParserRule[];

  constructor(...items: FxParserRule[]) {
    this.items = items;
  }

  public parse(elements: FxElement[], index: number, scope: string[]): FxParserRuleResult {

    const result = new FxParserRuleResult();

    for (let i = 0; i < this.items.length; i++) {
      const itemResult = this.items[i].parse(elements, index + result.offset, scope);

      if (itemResult.success) {
        result.elements.push(...itemResult.elements);
        result.offset += itemResult.offset;
      } else {
        return FxParserRuleResult.fail();
      }
    }

    return result;
  }
}
