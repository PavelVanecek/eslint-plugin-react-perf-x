import { createRule } from "../utils/common.js";

export = createRule(
  "jsx-no-jsx-as-prop",
  "Prevent JSX as JSX prop value",
  "JSX attribute values should not contain other JSX",
  (node) => {
    return node.type === "JSXElement" || node.type === "JSXFragment";
  }
);
