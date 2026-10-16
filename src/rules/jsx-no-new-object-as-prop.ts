import { checkConstructor, createRule } from "../utils/common.js";

export = createRule(
  "jsx-no-new-object-as-prop",
  "Prevent {...} as JSX prop value",
  "JSX attribute values should not contain objects created in the same scope",
  (node) => {
    return node.type === "ObjectExpression" || checkConstructor(node, "Object");
  }
);
