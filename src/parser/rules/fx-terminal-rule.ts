import {FxParserRule, FxParserRuleResult} from "../fx-parser-rule";
import {FxElement} from "../../fx-element";

export class FxTerminalRule implements FxParserRule {

  public symbol: string;

  constructor(symbol: string) {
    this.symbol = symbol;
  }

  public parse(elements: FxElement[], index: number, scope: string[]): FxParserRuleResult {
    if (index >= elements.length) {
      return FxParserRuleResult.fail();
    }

    const element = elements[index];

    if (element.tag == this.symbol) {
      return new FxParserRuleResult(1, element.clone());
    } else {
      return FxParserRuleResult.fail();
    }
  }
}
