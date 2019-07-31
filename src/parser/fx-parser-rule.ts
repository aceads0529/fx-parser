import {FxElement} from "../fx-element";

export abstract class FxParserRule {

  private _id: string;

  public get id(): string {
    return this._id;
  }

  public set id(id: string) {
    this._id = id;
    this.propagateId();
  }

  public abstract parse(elements: FxElement[], index: number, scope: string[]): FxParserRuleResult;

  protected propagateId(): void {}
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
