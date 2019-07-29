import {FxElement} from "./fx-element";
import {FxNode} from "./fx-node";

export class FxNodeCollection<T extends FxElement = FxElement> implements Iterable<FxNode> {

  private readonly owner: FxNode;
  private readonly _nodes: FxNode[];

  constructor(owner: FxNode) {
    this.owner = owner;
    this._nodes = [];
  }

  [Symbol.iterator](): Iterator<FxNode> {
    return this._nodes[Symbol.iterator]();
  }

  public push(...nodes: FxNode[]) {
    nodes = nodes.filter(n => n);
    for (const node of nodes) {
      FxNodeCollection.unlink(node);
      this.link(node);
    }
    return this._nodes.push(...nodes);
  }

  public unshift(...nodes: FxNode[]) {
    nodes = nodes.filter(n => n);
    for (const node of nodes) {
      FxNodeCollection.unlink(node);
      this.link(node);
    }
    return this._nodes.unshift(...nodes);
  }

  public pop() {
    const node = this._nodes.pop();
    FxNodeCollection.unlink(node);
    return node;
  }

  public shift() {
    const node = this._nodes.shift();
    FxNodeCollection.unlink(node);
    return node;
  }

  public splice(start: number, count: number, ...nodes: FxNode[]) {
    const removed = this._nodes.splice(start, count, ...nodes);

    for (const r of removed) {
      FxNodeCollection.unlink(r);
    }

    for (const node of nodes) {
      FxNodeCollection.unlink(node);
      this.link(node);
    }

    return removed;
  }

  public remove(node: FxNode) {
    const index = this.indexOf(node);
    if (index != -1) {
      return this.splice(index, 1)[0];
    } else {
      return undefined;
    }
  }

  public indexOf(node: FxNode) {
    return this._nodes.indexOf(node);
  }

  public get count() {
    return this._nodes.length;
  }

  public get first() {
    return this._nodes[0];
  }

  public get last() {
    return this._nodes[this._nodes.length - 1];
  }

  public map<U>(callback: (value: FxNode, index: number, array: FxNode[]) => U, thisArg?: any) {
    return this._nodes.map<U>(callback);
  }

  public filter<S extends FxNode>(callback: (value: FxNode, index: number, array: FxNode[]) => value is S, thisArg?: any) {
    return this._nodes.filter<S>(callback);
  }

  private link(node: FxNode) {
    node["_parent"] = this.owner;
  }

  private static unlink(node: FxNode) {
    const children = node && node.parent && node.parent.children._nodes;
    const index = children ? children.indexOf(node) : -1;
    if (index != -1) {
      children.splice(children.indexOf(node));
      node["_parent"] = null;
    }
  }
}
