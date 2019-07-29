import {FxToken} from "../fx-token";
import {FxTokenRule} from "./fx-token-rule";

export class FxType {
  public static readonly WHITESPACE = "whitespace";
  public static readonly BAD_CHARACTER = "bad-character";
}

export abstract class FxTokenizer {

  public static readonly START: string = "start";
  public static readonly ANY: string = "any";

  private readonly scopeRules: { [index: string]: FxTokenRule[] };

  private input: string;
  private scope: string[];
  private index: number;

  constructor() {
    this.scopeRules = {};
    this.rule(FxTokenizer.START);
    this.rule(FxTokenizer.ANY, new FxTokenRule(/\s+/, FxType.WHITESPACE));
    this.define();
  }

  public tokenize(input: string): FxToken[] {
    this.input = input;
    this.scope = [FxTokenizer.START];
    this.index = 0;

    const tokens: FxToken[] = [];

    while (this.index < this.input.length) {
      const rules = this.scopeRules[this.scope[0]].concat(this.scopeRules[FxTokenizer.ANY]);
      if (rules) {
        let matchFound = false;
        for (const rule of rules) {
          const match = rule.exec(this.input, this.index);
          if (match) {
            tokens.push(new FxToken(rule.callback(match, this.scope[0]), match));
            this.index += match.length;
            matchFound = true;
            break;
          }
        }
        if (!matchFound) {
          tokens.push(new FxToken(FxType.BAD_CHARACTER, this.input[this.index]));
          this.index++;
        }
      }
    }

    return tokens.filter(t => t.tag != FxType.WHITESPACE);
  }

  protected abstract define(): void;

  protected rule(scope: string, ...rules: FxTokenRule[]) {
    if (!this.scopeRules[scope]) {
      this.scopeRules[scope] = rules.concat();
    } else {
      this.scopeRules[scope].push(...rules);
    }
  }

  protected begin(scope: string) {
    this.scope[0] = scope;
  }

  protected push(scope: string) {
    this.scope.unshift(scope);
  }

  protected pop() {
    if (!this.scope.shift()) {
      this.scope.push(FxTokenizer.START);
    }
  }

  protected step(n: number) {
    this.index += n;
  }
}
