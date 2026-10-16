import { checkConstructor, createRule } from "../utils/common.js";

export = createRule(
  "Prevent [...] as JSX prop value",
  "JSX attribute values should not contain Arrays created in the same scope",
  (node) => {
    return node.type === "ArrayExpression" || checkConstructor(node, "Array");
  }
);
