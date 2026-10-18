import type { Rule } from "eslint";
import { createVisitor, docsUrl, schema } from "../utils/common.js";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prevent JSX as JSX prop value",
      recommended: true,
      url: docsUrl("jsx-no-jsx-as-prop"),
    },
    schema,
    messages: {
      jsxAsProp: "JSX attribute values should not contain other JSX",
    },
  },

  create(context) {
    return createVisitor(context, "jsxAsProp", (node) => {
      return node.type === "JSXElement" || node.type === "JSXFragment";
    });
  },
};

export = rule;
