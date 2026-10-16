"use strict";

function createRule(description, errorMessage, isViolation) {
  return {
    meta: {
      docs: {
        description,
        category: "",
        recommended: true,
      },
      schema: [
        {
          additionalProperties: false,
          properties: {
            nativeAllowList: {
              oneOf: [
                {
                  enum: ["all"],
                },
                {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              ],
            },
          },
          type: "object",
        },
      ],
    },

    create(context) {
      const { nativeAllowList } = context.options[0] || {};

      const isAllowedNative = (node) =>
        nativeAllowList === "all" ||
        (Array.isArray(nativeAllowList) &&
          nativeAllowList.some(
            (nativeExclude) =>
              node.name.name.toLowerCase() === nativeExclude.toLowerCase()
          ));

      return {
        JSXAttribute(node) {
          if (!node.value || node.value.type !== "JSXExpressionContainer") {
            return;
          }
          if (isNativeElement(node) && isAllowedNative(node)) {
            return;
          }

          for (const relevantNode of findRelevantNodes(
            context,
            node.value.expression
          )) {
            if (isViolation(relevantNode)) {
              context.report(relevantNode, errorMessage);
            }
          }
        },
      };
    },
  };
}

function findRelevantNodes(context, node) {
  const nodes = [];

  const visit = (node) => {
    if (node.type === "Literal") {
      // we have found a Literal (ex. 'foo', 1, false), bail
      return;
    }
    if (node.type === "Identifier") {
      const scope = context.sourceCode.getScope(node);
      const variable = scope.variables.find(({ name }) => name === node.name);
      if (!variable) {
        return;
      }
      for (const { identifier } of variable.references) {
        const { parent } = identifier;
        if (!parent) continue;
        switch (parent.type) {
          case "AssignmentExpression":
          case "AssignmentPattern":
            nodes.push(parent.right);
            break;
          case "VariableDeclarator":
            nodes.push(parent.init);
            break;
        }
      }
      return;
    }
    if (node.type === "LogicalExpression") {
      visit(node.left);
      visit(node.right);
      return;
    }
    if (node.type === "ConditionalExpression") {
      visit(node.consequent);
      visit(node.alternate);
      return;
    }

    nodes.push(node);
  };

  visit(node);
  return nodes;
}

function checkConstructor(node, className) {
  return (
    Boolean(node.callee) &&
    node.callee.name === className &&
    (node.type === "NewExpression" || node.type === "CallExpression")
  );
}

function isNativeElement(node) {
  if (node.parent.name.type !== "JSXIdentifier") {
    return false;
  }
  const nodeName = node.parent.name.name;
  const firstChar = nodeName.charAt(0);
  return firstChar === firstChar.toLowerCase();
}

module.exports = {
  createRule,
  checkConstructor,
};
