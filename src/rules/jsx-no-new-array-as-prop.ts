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
      description: "Prevent [...] as JSX prop value",
      recommended: true,
      url: docsUrl("jsx-no-new-array-as-prop"),
    },
    schema,
    messages: {
      newArray:
        "JSX attribute values should not contain Arrays created in the same scope",
    },
  },

  create(context) {
    return createVisitor(context, "newArray", (node) => {
      return node.type === "ArrayExpression" || checkConstructor(node, "Array");
    });
  },
};

export = rule;
