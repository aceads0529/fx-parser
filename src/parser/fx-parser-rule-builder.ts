import {FxParserRule} from "./fx-parser-rule";
import {FxBnfParser} from "./bnf/fx-bnf-parser";
import {FxBnfTokenizer} from "./bnf/fx-bnf-tokenizer";
import {FxElement} from "../fx-element";
import {FxParserRuleResolver} from "./fx-parser-base";
import {FxTerminalRule} from "./rules/fx-terminal-rule";
import {FxToken} from "../fx-token";
import {FxElementRule} from "./rules/fx-element-rule";
import {FxModifierRule} from "./rules/fx-modifier-rule";
import {FxSequenceRule} from "./rules/fx-sequence-rule";
import {FxLogicalRule} from "./rules/fx-logical-rule";

export class FxParserRuleBuilder {

  private readonly resolver: FxParserRuleResolver;
  private readonly tokenizer: FxBnfTokenizer;
  private readonly parser: FxBnfParser;

  private symbol: string;

  constructor(resolver: FxParserRuleResolver) {
    this.resolver = resolver;
    this.tokenizer = new FxBnfTokenizer();
    this.parser = new FxBnfParser();
  }

  public build(symbol: string, expr: string): FxParserRule {
    this.symbol = symbol;

    const tokens = this.tokenizer.tokenize(expr);
    const root = this.parser.parse(tokens);

    return this.parse(root);
  }

  private parse(root: FxElement): FxParserRule {
    let rule: FxParserRule = null;

    switch (root.tag) {
      case "root":
        rule = this.parse(root.children.first);
        break;
      case "sequence":
        rule = this.parseSequence(root);
        break;
      case "logical":
        rule = this.parseLogical(root);
        break;
      case "group":
        rule = this.parseGroup(root);
        break;
      case "term":
        rule = this.parseTerm(root);
        break;
      case "identifier":
        rule = this.parseTerminal(root);
        break;
      case "element":
        rule = this.parseElement(root);
        break;
    }

    if (rule) { rule.id = this.symbol; }
    return rule;
  }

  private parseSequence(root: FxElement): FxParserRule {
    const items = root.children.map(c => this.parse(c));

    if (items.length == 1) {
      return items[0];
    } else {
      return new FxSequenceRule(...items);
    }
  }

  private parseLogical(root: FxElement): FxParserRule {
    const items = root.children
      .filter(c => c.tag != "logical")
      .map(c => this.parse(c));

    return new FxLogicalRule(...items);
  }

  private parseTerm(root: FxElement): FxParserRule {
    const item = this.parse(root.children.first);

    if (root.children.count == 2) {
      const mod = <FxToken>root.children.last;
      return new FxModifierRule(<"*" | "?" | "+">mod.symbol, item);
    } else {
      return item;
    }
  }

  private parseGroup(root: FxElement): FxParserRule {
    return this.parse(root.children.get(1));
  }

  private parseTerminal(root: FxElement): FxParserRule {
    const symbol = (<FxToken>root).symbol;
    return new FxTerminalRule(symbol);
  }

  private parseElement(root: FxElement): FxParserRule {
    let symbol = (<FxToken>root).symbol;
    symbol = symbol.substr(1, symbol.length - 2);
    return new FxElementRule(symbol, this.resolver);
  }
}
