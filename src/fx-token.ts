import {FxElement} from "./fx-element";

export class FxToken extends FxElement {

  public readonly symbol: string;

  constructor(tag?: string, symbol?: string) {
    super(tag);
    this.symbol = symbol;
  }

  public toString(): string {
    return `<${this.tag}="${this.symbol}">`;
  }

  public clone() {
    return new FxToken(this.tag, this.symbol);
  }
}
