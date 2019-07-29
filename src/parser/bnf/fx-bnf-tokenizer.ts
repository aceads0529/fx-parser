import {FxTokenizer} from "../../tokenizer/fx-tokenizer";
import {FxTokenRule} from "../../tokenizer/fx-token-rule";

export class FxBnfTokenizer extends FxTokenizer {

  private static readonly IDENTIFIER_PATTERN: RegExp = /[a-zA-Z0-9\-]+/;
  private static readonly ELEMENT_PATTERN: RegExp = /{[a-zA-Z0-9\-]+}/;
  private static readonly MODIFIER_PATTERN: RegExp = /[*?+]/;

  protected define(): void {
    this.rule(FxTokenizer.START,
      new FxTokenRule(FxBnfTokenizer.IDENTIFIER_PATTERN, "identifier"),
      new FxTokenRule(FxBnfTokenizer.ELEMENT_PATTERN, "element"),
      new FxTokenRule(FxBnfTokenizer.MODIFIER_PATTERN, "modifier"),
      new FxTokenRule("(", "group-open"),
      new FxTokenRule(")", "group-close"),
      new FxTokenRule("|", "logical")
    );
  }
}
