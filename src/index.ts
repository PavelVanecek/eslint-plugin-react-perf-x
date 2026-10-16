import type { ESLint, Linter, Rule } from "eslint";
import jsxNoNewObjectAsProp = require("./rules/jsx-no-new-object-as-prop.js");
import jsxNoNewArrayAsProp = require("./rules/jsx-no-new-array-as-prop.js");
import jsxNoNewFunctionAsProp = require("./rules/jsx-no-new-function-as-prop.js");
import jsxNoJsxAsProp = require("./rules/jsx-no-jsx-as-prop.js");

// Not an import: package.json lives outside of rootDir and must stay the one
// next to dist/ at runtime.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg: { name: string; version: string } = require("../package.json");

type RuleName =
  | "jsx-no-new-object-as-prop"
  | "jsx-no-new-array-as-prop"
  | "jsx-no-new-function-as-prop"
  | "jsx-no-jsx-as-prop";

type ReactPerfPlugin = ESLint.Plugin & {
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

const allRules: Record<RuleName, Rule.RuleModule> = {
  "jsx-no-new-object-as-prop": jsxNoNewObjectAsProp,
  "jsx-no-new-array-as-prop": jsxNoNewArrayAsProp,
  "jsx-no-new-function-as-prop": jsxNoNewFunctionAsProp,
  "jsx-no-jsx-as-prop": jsxNoJsxAsProp,
};

const configureAsError = (rules: Record<string, unknown>): Linter.RulesRecord =>
  Object.fromEntries(Object.keys(rules).map((key) => [`react-perf/${key}`, 2]));

const parserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
};

const recommendedRules: Linter.RulesRecord = {
  "react-perf/jsx-no-new-object-as-prop": 2,
  "react-perf/jsx-no-new-array-as-prop": 2,
  "react-perf/jsx-no-new-function-as-prop": 2,
};

const allRulesAsError = configureAsError(allRules);

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
    namespace: "react-perf",
  },
  rules: allRules,
  // Filled in below, the configs reference the plugin itself.
  configs: {},
} as ReactPerfPlugin;

const flatConfig = (name: string, rules: Linter.RulesRecord): Linter.Config => ({
  name: `react-perf/${name}`,
  plugins: { "react-perf": plugin },
  rules,
  languageOptions: { parserOptions },
});

plugin.configs.recommended = flatConfig("recommended", recommendedRules);
plugin.configs.all = flatConfig("all", allRulesAsError);

// Same as configs.recommended / configs.all, for drop-in compatibility with
// eslint-plugin-react-perf, which only exported configs.flat.*.
plugin.configs.flat = {
  recommended: plugin.configs.recommended,
  all: plugin.configs.all,
};

export = plugin;
