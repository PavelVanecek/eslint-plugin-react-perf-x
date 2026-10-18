import type { Rule } from "eslint";
import {
  checkConstructor,
  createVisitor,
  docsUrl,
  schema,
} from "../utils/common.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prevent `function` as JSX prop value",
      recommended: true,
      url: docsUrl("jsx-no-new-function-as-prop"),
    },
    schema,
    messages: {
      newFunction:
        "JSX attribute values should not contain functions created in the same scope",
    },
  },

  create(context) {
    return createVisitor(context, "newFunction", (node) => {
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
    });
  },
};

export = rule;
