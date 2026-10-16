"use strict";

const pkg = require("./package.json");

const allRules = {
  "jsx-no-new-object-as-prop": require("./lib/rules/jsx-no-new-object-as-prop"),
  "jsx-no-new-array-as-prop": require("./lib/rules/jsx-no-new-array-as-prop"),
  "jsx-no-new-function-as-prop": require("./lib/rules/jsx-no-new-function-as-prop"),
  "jsx-no-jsx-as-prop": require("./lib/rules/jsx-no-jsx-as-prop"),
};

const configureAsError = (rules) =>
  Object.fromEntries(Object.keys(rules).map((key) => [`react-perf/${key}`, 2]));

const parserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
};

const recommendedRules = {
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
  configs: {},
};

const flatConfig = (name, rules) => ({
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

module.exports = plugin;
