import type { Rule } from "eslint";
import type * as ESTree from "estree";

// @types/estree has no JSX nodes, so describe the parts the rules look at.
interface JSXIdentifier {
  type: "JSXIdentifier";
  name: string;
}

interface JSXNamespacedName {
  type: "JSXNamespacedName";
  namespace: JSXIdentifier;
  name: JSXIdentifier;
}

interface JSXOpeningElement {
  type: "JSXOpeningElement";
  name: JSXIdentifier | JSXNamespacedName | { type: "JSXMemberExpression" };
}

interface JSXAttribute {
  type: "JSXAttribute";
  name: JSXIdentifier | JSXNamespacedName;
  value:
    | { type: "JSXExpressionContainer"; expression: ESTree.Expression }
    | { type: string }
    | null;
  parent: JSXOpeningElement;
}

export type SyntaxNode =
  | ESTree.Node
  | { type: "JSXElement" | "JSXFragment"; loc?: ESTree.SourceLocation | null };

interface RuleOptions {
  nativeAllowList?: "all" | string[];
}

export const docsUrl = (name: string): string =>
  `https://github.com/PavelVanecek/eslint-plugin-react-perf-x/blob/master/docs/rules/${name}.md`;

export const schema: Rule.RuleMetaData["schema"] = [
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
];

export function createVisitor(
  context: Rule.RuleContext,
  messageId: string,
  isViolation: (node: SyntaxNode) => boolean
): Rule.RuleListener {
  const { nativeAllowList }: RuleOptions = context.options[0] || {};

  const isAllowedNative = (node: JSXAttribute) =>
    nativeAllowList === "all" ||
    (Array.isArray(nativeAllowList) &&
      nativeAllowList.some(
        (nativeExclude) =>
          attributeName(node).toLowerCase() === nativeExclude.toLowerCase()
      ));

  return {
    JSXAttribute(ruleNode: Rule.Node) {
      const node = ruleNode as unknown as JSXAttribute;
      if (!node.value || !("expression" in node.value)) {
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
          context.report({
            node: relevantNode as ESTree.Node,
            messageId,
          });
        }
      }
    },
  };
}

function findRelevantNodes(
  context: Rule.RuleContext,
  node: ESTree.Node
): SyntaxNode[] {
  const nodes: SyntaxNode[] = [];

  const visit = (node: ESTree.Node) => {
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
        const { parent } = identifier as Rule.Node;
        if (!parent) continue;
        switch (parent.type) {
          case "AssignmentExpression":
          case "AssignmentPattern":
            nodes.push(parent.right);
            break;
          case "VariableDeclarator":
            if (parent.init) nodes.push(parent.init);
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

export function checkConstructor(node: SyntaxNode, className: string): boolean {
  return (
    (node.type === "NewExpression" || node.type === "CallExpression") &&
    node.callee.type === "Identifier" &&
    node.callee.name === className
  );
}

function attributeName(node: JSXAttribute): string {
  return node.name.type === "JSXIdentifier"
    ? node.name.name
    : `${node.name.namespace.name}:${node.name.name.name}`;
}

function isNativeElement(node: JSXAttribute): boolean {
  if (node.parent.name.type !== "JSXIdentifier") {
    return false;
  }
  const nodeName = node.parent.name.name;
  const firstChar = nodeName.charAt(0);
  return firstChar === firstChar.toLowerCase();
}
