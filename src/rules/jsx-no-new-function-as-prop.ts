import { checkConstructor, createRule } from "../utils/common.js";

export = createRule(
  "jsx-no-new-function-as-prop",
  "Prevent `function` as JSX prop value",
  "JSX attribute values should not contain functions created in the same scope",
  (node) => {
    if (
      node.type === "FunctionExpression" ||
      node.type === "ArrowFunctionExpression" ||
      checkConstructor(node, "Function")
    ) {
      return true;
    }

    // <Item onClick={this.clickHandler.bind(this)} />
    if (
      node.type === "CallExpression" &&
      node.callee.type === "MemberExpression" &&
      node.callee.property.type === "Identifier" &&
      node.callee.property.name === "bind"
    ) {
      return true;
    }

    return false;
  }
);
