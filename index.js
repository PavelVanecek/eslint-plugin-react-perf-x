"use strict";

var pkg = require('./package.json');

var allRules = {
  "jsx-no-new-object-as-prop": require("./lib/rules/jsx-no-new-object-as-prop"),
  "jsx-no-new-array-as-prop": require("./lib/rules/jsx-no-new-array-as-prop"),
  "jsx-no-new-function-as-prop": require("./lib/rules/jsx-no-new-function-as-prop"),
  "jsx-no-jsx-as-prop": require("./lib/rules/jsx-no-jsx-as-prop")
};

function configureAsError(rules) {
  var result = {};
  for (var key in rules) {
    if (!Object.hasOwn(rules, key)) {
      continue;
    }
    result["react-perf/" + key] = 2;
  }
  return result;
}

var parserOptions = {
  ecmaFeatures: {
    jsx: true
  }
};

var recommendedRules = {
  "react-perf/jsx-no-new-object-as-prop": 2,
  "react-perf/jsx-no-new-array-as-prop": 2,
  "react-perf/jsx-no-new-function-as-prop": 2
};

var allRulesAsError = configureAsError(allRules);

var plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
    namespace: "react-perf"
  },
  rules: allRules,
  configs: {}
};

function flatConfig(name, rules) {
  return {
    name: "react-perf/" + name,
    plugins: { "react-perf": plugin },
    rules: rules,
    languageOptions: { parserOptions: parserOptions }
  };
}

plugin.configs.recommended = flatConfig("recommended", recommendedRules);
plugin.configs.all = flatConfig("all", allRulesAsError);

// Same as configs.recommended / configs.all, for drop-in compatibility with
// eslint-plugin-react-perf, which only exported configs.flat.*.
plugin.configs.flat = {
  recommended: plugin.configs.recommended,
  all: plugin.configs.all
};

module.exports = plugin;
