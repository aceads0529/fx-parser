import {FxNode} from "./fx-node";

export class FxElement extends FxNode {

  public tag: string;

  constructor(tag: string) {
    super();
    this.tag = tag;
  }

  public toString(): string {
    return "<" + this.tag + ">";
  }

  public clone(): FxElement {
    return new FxElement(this.tag);
  }
}
