export interface FxParserItem {
  symbol: string;
  isTerminal: boolean;
}

export interface FxParserRule {

  hasNext: boolean;

  reset(): void;

  next(prevPassed: boolean): FxParserItem | boolean;
}

export class FxElementRule implements FxParserRule {

  public hasNext: boolean;

  private readonly item: FxParserItem;

  constructor(symbol: string, isTerminal?: boolean) {
    this.item = {
      symbol: symbol,
      isTerminal: isTerminal != undefined ? isTerminal : true
    };

    this.reset();
  }

  public reset() {
    this.hasNext = true;
  }

  public next(prevPassed: boolean) {
    if (this.hasNext) {
      this.hasNext = false;
      return this.item;
    } else {
      return !prevPassed;
    }
  }
}

export class FxLogicalRule implements FxParserRule {

  public hasNext: boolean;
  private index: number;

  private readonly items: FxParserRule[];

  constructor(...items: FxParserRule[]) {
    this.items = items;
    this.reset();
  }

  public next(prevPassed: boolean) {
    const next = this.items[this.index].next(prevPassed);

    if (next == true) {
      return true;
    } else if (next == false) {
      this.index++;
      if (this.index == this.items.length) {
        return false;
      } else {
        return this.items[this.index].next(null);
      }
    } else {
      return next;
    }
  }

  public reset(): void {
    this.index = 0;
    this.hasNext = true;
  }
}

export class FxSequenceRule implements FxParserRule {

  private readonly items: FxParserItem[];

  constructor(items)
}