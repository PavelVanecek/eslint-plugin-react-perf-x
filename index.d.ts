import type { ESLint, Linter, Rule } from "eslint";

type RuleName =
  | "jsx-no-new-object-as-prop"
  | "jsx-no-new-array-as-prop"
  | "jsx-no-new-function-as-prop"
  | "jsx-no-jsx-as-prop";

declare const plugin: ESLint.Plugin & {
  meta: {
    name: string;
    version: string;
    namespace: "react-perf";
  };
  rules: Record<RuleName, Rule.RuleModule>;
  configs: {
    recommended: Linter.Config;
    all: Linter.Config;
    flat: {
      recommended: Linter.Config;
      all: Linter.Config;
    };
  };
};

export = plugin;
