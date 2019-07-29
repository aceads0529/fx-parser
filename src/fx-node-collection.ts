import {FxNode} from "./fx-node";

export class FxNodeCollection<T extends FxNode = FxNode> implements Iterable<FxNode> {

  private readonly owner: FxNode;
  private readonly _items: T[];

  constructor(owner: FxNode) {
    this.owner = owner;
    this._items = [];
  }

  public [Symbol.iterator](): Iterator<T> {
    return this._items[Symbol.iterator]();
  }

  public push(...items: T[]): number {
    items = items.filter(n => n);
    for (const node of items) {
      FxNodeCollection.unlink(node);
      this.link(node);
    }
    return this._items.push(...items);
  }

  public unshift(...items: T[]): number {
    items = items.filter(n => n);
    for (const node of items) {
      FxNodeCollection.unlink(node);
      this.link(node);
    }
    return this._items.unshift(...items);
  }

  public pop(): T {
    const item = this._items.pop();
    FxNodeCollection.unlink(item);
    return item;
  }

  public shift(): T {
    const item = this._items.shift();
    FxNodeCollection.unlink(item);
    return item;
  }

  public splice(start: number, count: number, ...items: T[]): T[] {
    const removed = this._items.splice(start, count, ...items);

    for (const r of removed) {
      FxNodeCollection.unlink(r);
    }

    for (const item of items) {
      FxNodeCollection.unlink(item);
      this.link(item);
    }

    return removed;
  }

  public remove(node: T): T {
    const index = this.indexOf(node);
    if (index != -1) {
      return this.splice(index, 1)[0];
    } else {
      return undefined;
    }
  }

  public indexOf(node: T): number {
    return this._items.indexOf(node);
  }

  public get count(): number {
    return this._items.length;
  }

  public get(index: number): T {
    return this._items[index];
  }

  public get first(): T {
    return this._items[0];
  }

  public get last(): T {
    return this._items[this._items.length - 1];
  }

  public map<U>(callback: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
    return this._items.map<U>(callback, thisArg);
  }

  public filter(callback: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[] {
    return this._items.filter(callback, thisArg);
  }

  private link(node: FxNode): void {
    node["_parent"] = this.owner;
  }

  private static unlink(node: FxNode): void {
    const children = node && node.parent && node.parent.children._items;
    const index = children ? children.indexOf(node) : -1;
    if (index != -1) {
      children.splice(children.indexOf(node));
      node["_parent"] = null;
    }
  }
}
