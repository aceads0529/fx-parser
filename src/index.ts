import {FxTokenizer, FxType} from "./tokenizer/fx-tokenizer";
import {FxParser} from "./parser/fx-parser";
import {FxTokenRule} from "./tokenizer/fx-token-rule";
import {FxElementRule, FxLogicalRule} from "./parser/fx-parser-rule";

class JsonFxTypes {
  public static readonly IDENTIFIER = "identifier";
  public static readonly LETTER = "letter";
  public static readonly NUMBER = "number";
  public static readonly OPERATOR = "number";
  public static readonly GROUP_OPEN = "group-open";
  public static readonly GROUP_CLOSE = "group-close";
  public static readonly COMMA = "comma";
}

class JsonFxTokenizer extends FxTokenizer {

  public static readonly GROUP = "group";

  protected define(): void {
    this.rule(FxTokenizer.ANY,
      new FxTokenRule(/\s+/, () => FxType.WHITESPACE)
    );

    this.rule(FxTokenizer.START,
      new FxTokenRule(/[a-zA-Z][a-zA-Z0-9]*/, () => JsonFxTypes.IDENTIFIER),
      new FxTokenRule(/-?([1-9][0-9]*)|([0-9]+(\.[0-9]+)?)/, () => JsonFxTypes.NUMBER),
      new FxTokenRule(/[+\-*/]/, () => JsonFxTypes.OPERATOR),
      new FxTokenRule("(", () => JsonFxTypes.GROUP_OPEN),
      new FxTokenRule(")", () => JsonFxTypes.GROUP_CLOSE),
      new FxTokenRule(",", () => JsonFxTypes.COMMA)
    );
  }
}

class JsonFxParser extends FxParser {

  protected define() {
    this.rule("term", new FxLogicalRule(new FxElementRule("identifier"), new FxElementRule("number")));
    this.rule("call", new FxElementRule("term", false), new FxElementRule("group-open"), new FxElementRule("group-close"));
  }
}

const tokenizer = new JsonFxTokenizer();
const tokens = tokenizer.tokenize("(");

const parser = new JsonFxParser();
const tree = parser.parse(tokens);

console.log(tokens.map(t => t.toString()).join(" "));
console.log(tree.toMultilineString());

