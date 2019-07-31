import {SampleTokenizer} from "./sample-tokenizer";
import {SampleParser} from "./sample-parser";

const tokenizer = new SampleTokenizer();
const parser = new SampleParser();

const expression = "a+b:b:c";

const tokens = tokenizer.tokenize(expression);
console.log(tokens.map(t => t.toString()).join(" "));

const root = parser.parse(tokens);
console.log(root.toMultilineString());
