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
      description: "Prevent {...} as JSX prop value",
      recommended: true,
      url: docsUrl("jsx-no-new-object-as-prop"),
    },
    schema,
    messages: {
      newObject:
        "JSX attribute values should not contain objects created in the same scope",
    },
  },

  create(context) {
    return createVisitor(context, "newObject", (node) => {
      return node.type === "ObjectExpression" || checkConstructor(node, "Object");
    });
  },
};

export = rule;
