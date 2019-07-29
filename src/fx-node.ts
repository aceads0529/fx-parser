import {FxNodeCollection} from "./fx-node-collection";

export class FxNode {

  public _parent: this;
  public readonly children: FxNodeCollection<this>;

  constructor() {
    this.children = new FxNodeCollection(this);
  }

  public get parent(): this {
    return this._parent;
  }

  public orphan(): void {
    if (this._parent) {
      this._parent.children.remove(this);
    }
  }

  public validate(): boolean {
    for (const child of this.children) {
      if (child.parent != this || !child.validate()) {
        return false;
      }
    }
    return true;
  }

  public toMultilineString(indent?: number): string {
    if (indent == undefined) {
      indent = 0;
    }

    const indentStr = "  ".repeat(indent);
    let result = indentStr + this.toString();

    if (this.children.count > 0) {
      const childrenStr = this.children.map(c => c.toMultilineString(indent + 1)).join("\n");
      result += " {\n" + childrenStr + "\n" + indentStr + "}";
    }

    return result;
  }
}
