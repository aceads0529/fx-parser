import {FxElement} from "../fx-element";

export interface FxParserRule {
  parse(elements: FxElement[], index: number, scope: string[]): FxParserRuleResult;
}

export class FxParserRuleResult {

  public readonly success: boolean;
  public elements: FxElement[];
  public offset: number;

  constructor(offset?: number, ...elements: FxElement[]) {
    this.elements = elements;
    this.offset = offset || 0;
    this.success = true;
  }

  public static fail(): FxParserRuleResult {
    return {elements: [], offset: 0, success: false};
  }
}

export interface FxParserRuleOptions {
  isPrivate: boolean;
}
