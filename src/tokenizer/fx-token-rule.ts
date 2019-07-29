type FxRuleCallback = (symbol: string, scope: string) => string;

export class FxTokenRule {

  public readonly test: RegExp | string;
  public readonly callback: FxRuleCallback;

  private readonly executor: (test: string | RegExp, source: string, index: number) => string | null;

  constructor(test: RegExp | string, callback: FxRuleCallback | string) {
    this.callback = typeof callback == "string" ? () => callback : callback;
    if (typeof test == "string") {
      this.test = test;
      this.executor = FxTokenRule.execLiteralTest;
    } else {
      this.test = FxTokenRule.normalizeTest(test);
      this.executor = FxTokenRule.execRegexpTest;
    }
  }

  public exec(source: string, index: number): string {
    return this.executor(this.test, source, index);
  }

  private static execLiteralTest(test: string, source: string, index: number): string {
    for (let i = 0; i < test.length; i++) {
      if (test[i] != source[i + index]) {
        return null;
      }
    }
    return test;
  }

  private static execRegexpTest(test: RegExp, source: string, index: number): string {
    test.lastIndex = index;
    const match = test.exec(source);
    if (match) {
      return match[0];
    } else {
      return
    }
  }

  private static normalizeTest(test: RegExp): RegExp {
    return new RegExp(test.source, "y");
  }
}
