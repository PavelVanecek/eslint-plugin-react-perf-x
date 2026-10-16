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
    version: pkg.version
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

function legacyConfig(rules) {
  return {
    plugins: ["react-perf"],
    parserOptions: parserOptions,
    rules: rules
  };
}

plugin.configs.recommended = flatConfig("recommended", recommendedRules);
plugin.configs.all = flatConfig("all", allRulesAsError);

// eslintrc configs, for ESLint 9 with ESLINT_USE_FLAT_CONFIG=false.
// ESLint 10 no longer supports eslintrc.
plugin.configs["legacy-recommended"] = legacyConfig(recommendedRules);
plugin.configs["legacy-all"] = legacyConfig(allRulesAsError);

// Kept for backwards compatibility; same as configs.recommended / configs.all.
plugin.configs.flat = {
  recommended: plugin.configs.recommended,
  all: plugin.configs.all
};

module.exports = plugin;
