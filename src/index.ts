import {FxParser} from "./parser/fx-parser";
import {FxTokenizer} from "./tokenizer/fx-tokenizer";
import {FxTokenRule} from "./tokenizer/fx-token-rule";
import {FxElement} from "./fx-element";

const remove = [
  "group-open", "group-close",
  "brace-open", "brace-close",
  "brack-open", "brack-close",
  "dynamic-open", "dynamic-close",
  "comma", "colon", "assign"
];

class JsonFxTokenizer extends FxTokenizer {

  protected define(): void {
    this.rule("object-literal-key",
      new FxTokenRule("{", () => {
        this.push("dynamic-key");
        return "brace-open";
      }),
      new FxTokenRule("()", "return-key"),
      new FxTokenRule(":", () => {
        this.begin("object-literal-value");
        return "assign";
      }),
    );

    this.rule("dynamic-key",
      new FxTokenRule("}", () => {
        this.pop();
        return "brace-close";
      })
    );

    this.rule("object-literal-value",
      new FxTokenRule(",", () => {
        this.begin("object-literal-key");
        return "comma";
      }),
      new FxTokenRule("{", () => {
        this.push("object-literal-value");
        return "brace-open";
      }),
      new FxTokenRule("}", () => {
        this.pop();
        return "brace-close";
      })
    );

    this.rule(FxTokenizer.ANY,
      new FxTokenRule(/[a-zA-Z_~][a-zA-Z0-9_~]*/, "identifier"),
      new FxTokenRule(/[0-9]+\.?[0-9]*/, "number"),
      new FxTokenRule(/\$[a-zA-Z0-9_~]*/, "variable"),
      new FxTokenRule(/@[a-zA-Z0-9_~]*/, "template"),
      new FxTokenRule(/[+\-*/]+|=>/, "operator"),
      new FxTokenRule(":", "colon"),
      new FxTokenRule(",", "comma"),
      new FxTokenRule("(", "group-open"),
      new FxTokenRule(")", "group-close"),
      new FxTokenRule("[", () => {
        this.push("array");
        return "brack-open";
      }),
      new FxTokenRule("]", () => {
        this.pop();
        return "brack-close";
      }),
      new FxTokenRule(/'[^']*'/, "literal"),
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
    this.rule("root", "{expr}");

    this.rule("array", "brack-open ({expr} (comma {expr})*)? brack-close");

    this.rule("object", "brace-open ({object-prop} (comma {object-prop})*)? brace-close");
    this.rule("object-prop", "{dynamic-key}|{template-decl}|return-key|identifier|variable assign {expr}");
    this.rule("dynamic-key", "brace-open {expr} brace-close");
    this.rule("template-decl", "template group-open (variable (comma variable)*)? group-close");

    this.rule("expr", "{operation}|{term}", {isPrivate: true});
    this.rule("operation", "{term} (operator {term})+");

    this.rule("invoke", "{term} colon {call}");
    this.rule("group", "group-open ({expr} (comma {expr})*)? group-close");
    this.rule("call", "template|identifier group-open ({expr} (comma {expr})*)? group-close");

    this.rule("indexer", "{term} brack-open ({expr} (comma {expr})*)? brack-close");
    this.rule("object-indexer", "{term} brace-open ({expr} (comma {expr})*)? brace-close");

    this.rule("term", "{object-indexer}|{indexer}|{object}|{array}|{invoke}|{group}|{call}|identifier|number|variable|template|literal", {isPrivate: true});
  }
}

/*

{
  @email($first, $last, $domain): lowercase($first[0] + $last) + '@' + $domain,
  @user($u): {
    $names: $u.name:split(' '),
    firstName: $names[0],
    lastName: $names[1]
  },
  (): $:map(@user):map($ => @email($.firstName, $.lastName, 'gmail.com'))
}

 */

const expression = "a(1 + 2) + 3";

// const expression =
//         "{\n" +
//         "  @email($first, $last, $domain): lowercase($first[0] + $last) + '@' + $domain,\n" +
//         "  @user($u): {\n" +
//         "    $names: $u.name:split(' '),\n" +
//         "    firstName: $names[0],\n" +
//         "    lastName: $names[1]\n" +
//         "  },\n" +
//         "  (): $:map(@user):map($ => @email($.firstName, $.lastName, 'gmail.com'))\n" +
//         "}";

const tokenizer = new JsonFxTokenizer();
const parser = new JsonFxParser();

const tokens = tokenizer.tokenize(expression);
console.log(tokens.map(t => t.toString()).join(" "));

const tree = parser.parse(tokens);
optimize(tree);

console.log(tree.toMultilineString());

function optimize(tree: FxElement): void {
  for (const child of tree.children) {
    optimize(child);
  }

  if (tree.tag == "operation" && tree.parent && tree.parent.tag == "operation") {
    const i = tree.parent.children.indexOf(tree);
    tree.parent.children.splice(i, 0, ...tree.children);
    tree.parent.children.remove(tree);
  } else {
    const children = tree.children.concat();

    for (const child of children) {
      if (remove.indexOf(child.tag) != -1) {
        tree.children.remove(child);
      }
    }
  }
}
