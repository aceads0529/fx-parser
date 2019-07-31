import {FxTokenizer} from "../tokenizer/fx-tokenizer";
import {FxTokenRule} from "../tokenizer/fx-token-rule";

export class SampleTokenizer extends FxTokenizer {

  protected define(): void {
    this.rule(FxTokenizer.START,
      new FxTokenRule(/[a-z]+/, "identifier"),
      new FxTokenRule(":", "colon"),
      new FxTokenRule(/[+\-*/]/, "op")
    );
  }
}
