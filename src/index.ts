import {FxParserRuleBuilder} from "./parser/fx-parser-rule-builder";
import {FxParser} from "./parser/fx-parser";
import {FxToken} from "./fx-token";
import {FxTokenizer} from "./tokenizer/fx-tokenizer";
import {FxTokenRule} from "./tokenizer/fx-token-rule";
import {FxElement} from "./fx-element";

class JsonFxTokenizer extends FxTokenizer {

  protected define(): void {
    this.rule("string-literal",
      new FxTokenRule(/[^']+/, "literal-text"),
      new FxTokenRule("'", () => {
        this.pop();
        return "literal";
      })
    );

    this.rule("object-literal-key",
      new FxTokenRule("{", () => {
        this.push("dynamic-key");
        return "dynamic-open";
      }),
      new FxTokenRule(":", () => {
        this.begin("object-literal-value");
        return "assign";
      }),
    );

    this.rule("dynamic-key",
      new FxTokenRule("}", () => {
        this.pop();
        return "dynamic-close";
      })
    );

    this.rule("object-literal-value",
      new FxTokenRule(",", () => {
        this.begin("object-literal-key");
        return "comma";
      }),
      new FxTokenRule("}", () => {
        this.pop();
        return "brace-close";
      })
    );

    this.rule(FxTokenizer.ANY,
      new FxTokenRule(/[a-zA-Z_~][a-zA-Z0-9_~]*/, "identifier"),
      new FxTokenRule(/[0-9]\.?[0-9]*/, "number"),
      new FxTokenRule(/\$[a-zA-Z0-9_~]*/, "variable"),
      new FxTokenRule(/@[a-zA-Z0-9_~]/, "template"),
      new FxTokenRule(/[+\-*/]+/, "operator"),
      new FxTokenRule(":", "colon"),
      new FxTokenRule(",", "comma"),
      new FxTokenRule("(", "group-open"),
      new FxTokenRule(")", "group-close"),
      new FxTokenRule("[", "brack-open"),
      new FxTokenRule("]", "brack-close"),
      new FxTokenRule("'", () => {
        this.push("string-literal");
        return "literal"
      }),
      new FxTokenRule("{", () => {
        this.push("object-literal-key");
        return "brace-open";
      }),
      new FxTokenRule("}", "brace-close")
    );
  }
}

class JsonFxParser extends FxParser {

  protected define(): void {
    this.rule("root", "{term-group}");
    this.rule("term", "{group}|{object}|{array}|{literal}|{call}|identifier|number|variable|template", {isPrivate: true});
    this.rule("term-group", "{invoke}|{operation}|{term}", {isPrivate: true});

    this.rule("literal", "literal literal-text literal");

    this.rule("object", "brace-open ({object-prop} (comma {object-prop})*)? brace-close");
    this.rule("object-prop", "{dynamic-key}|identifier|variable|template assign {term-group}");

    this.rule("dynamic-key", "dynamic-open {term-group} dynamic-close");

    this.rule("group", "group-open ({term-group} (comma {term-group})*)? group-close");
    this.rule("array", "brack-open ({term-group} (comma {term-group})*)? brack-close");
    this.rule("operation", "{term} operator {operation}|{term}");
    this.rule("invoke", "{term} colon {call}|identifier|template");
    this.rule("call", "identifier|template {group}");
  }
}

const remove = [
  "group-open", "group-close",
  "brace-open", "brace-close",
  "brack-open", "brack-close",
  "dynamic-open", "dynamic-close",
  "comma", "colon", "assign"
];

function optimize(tree: FxElement): void {
  for (const child of tree.children) {
    optimize(child);
  }

  for (const child of tree.children) {
    if (remove.indexOf(child.tag) != -1) {
      tree.children.remove(child);
    }
  }
}

const expression = "{ { a:add(b) }: 10, c: [10, d:add(10)] }";

const tokenizer = new JsonFxTokenizer();
const parser = new JsonFxParser();

const tokens = tokenizer.tokenize(expression);
console.log(tokens.map(t => t.toString()).join(" "));

const tree = parser.parse(tokens);
optimize(tree);

console.log(tree.toMultilineString());
