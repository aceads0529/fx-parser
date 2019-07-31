import {FxParserRule, FxParserRuleResult} from "../fx-parser-rule";
import {FxElement} from "../../fx-element";
import {FxElementRule} from "./fx-element-rule";

export class FxSequenceRule extends FxParserRule {

  public items: FxParserRule[];

  constructor(...items: FxParserRule[]) {
    super();
    this.items = items;
  }

  public parse(elements: FxElement[], index: number, scope: string[]): FxParserRuleResult {
    const result = new FxParserRuleResult();

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      if (i == 0 && item instanceof FxElementRule) {
        scope.push(this.id);
      }

      const itemResult = this.items[i].parse(elements, index + result.offset, scope);

      if (i == 0 && item instanceof FxElementRule) {
        scope.pop();
      }

      if (itemResult.success) {
        result.elements.push(...itemResult.elements);
        result.offset += itemResult.offset;
      } else {
        return FxParserRuleResult.fail();
      }
    }

    return result;
  }

  protected propagateId(): void {
    this.items.forEach(i => i.id = this.id);
  }
}
