import {FxParser} from "../parser/fx-parser";

export class SampleParser extends FxParser {

  protected define(): void {
    this.rule("root", "{term}");
    this.rule("invoke", "{term} colon {term}");
    this.rule("operation", "{term} op {term}");
    this.rule("term", "{invoke}|{operation}|identifier", {isPrivate: true});
  }
}
