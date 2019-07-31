import {FxParserBase} from "../fx-parser-base";
import {FxElementRule} from "../rules/fx-element-rule";
import {FxLogicalRule} from "../rules/fx-logical-rule";
import {FxTerminalRule} from "../rules/fx-terminal-rule";
import {FxSequenceRule} from "../rules/fx-sequence-rule";
import {FxModifierRule} from "../rules/fx-modifier-rule";

export class FxBnfParser extends FxParserBase {

  protected define(): void {
    this.rule("root", new FxLogicalRule(
      new FxElementRule("sequence", this),
      new FxElementRule("logical", this),
      new FxElementRule("term", this),
    ));

    this.rule("sequence", new FxModifierRule("+", new FxLogicalRule(
      new FxElementRule("logical", this),
      new FxElementRule("term", this)
    )));

    this.rule("term", new FxSequenceRule(
      new FxLogicalRule(
        new FxElementRule("group", this),
        new FxTerminalRule("element"),
        new FxTerminalRule("identifier")
      ),
      new FxModifierRule("?", new FxTerminalRule("modifier"))
    ));

    this.rule("group", new FxSequenceRule(
      new FxTerminalRule("group-open"),
      new FxElementRule("sequence", this),
      new FxTerminalRule("group-close")
    ));

    // {term} (logical {term})+
    this.rule("logical", new FxSequenceRule(
      new FxElementRule("term", this),
      new FxModifierRule("+", new FxSequenceRule(
        new FxTerminalRule("logical"),
        new FxElementRule("term", this)
      ))
    ));
  }
}
