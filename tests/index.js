"use strict";

var plugin = require("..");

var assert = require("assert");
var Linter = require("eslint").Linter;
var fs = require("fs");
var path = require("path");

var ruleFiles = fs
  .readdirSync(path.resolve(__dirname, "../lib/rules/"))
  .map(function(f) {
    return path.basename(f, ".js");
  });

describe("all rule files should be exported by the plugin", function() {
  ruleFiles.forEach(function(ruleName) {
    it("should export " + ruleName, function() {
      assert.equal(
        plugin.rules[ruleName],
        require(path.join("../lib/rules", ruleName))
      );
    });
  });
});

function assertAllRulesAsError(rules) {
  Object.keys(rules).forEach(function(configName) {
    assert.equal(configName.indexOf("react-perf/"), 0);
    assert.equal(rules[configName], 2);
  });
  ruleFiles.forEach(function(ruleName) {
    assert(Boolean(rules["react-perf/" + ruleName]));
  });
}

describe("configurations", function() {
  it("should export a flat 'all' configuration", function() {
    assert.equal(plugin.configs.all.plugins["react-perf"], plugin);
    assertAllRulesAsError(plugin.configs.all.rules);
  });

  it("should export a flat 'recommended' configuration", function() {
    assert.equal(plugin.configs.recommended.plugins["react-perf"], plugin);
    assert.equal(
      plugin.configs.recommended.languageOptions.parserOptions.ecmaFeatures.jsx,
      true
    );
  });

  it("should keep configs.flat as aliases", function() {
    assert.equal(plugin.configs.flat.all, plugin.configs.all);
    assert.equal(plugin.configs.flat.recommended, plugin.configs.recommended);
  });

  it("should not export eslintrc configurations", function() {
    Object.keys(plugin.configs)
      .filter(function(configName) {
        return configName !== "flat";
      })
      .forEach(function(configName) {
        assert.equal(Array.isArray(plugin.configs[configName].plugins), false);
      });
  });

  ["recommended", "all"].forEach(function(configName) {
    it("should lint with the flat '" + configName + "' configuration", function() {
      var linter = new Linter();
      var messages = linter.verify(
        "<Item prop={{}} />",
        [plugin.configs[configName]],
        "test.js"
      );
      assert.deepEqual(
        messages.map(function(message) {
          return message.ruleId;
        }),
        ["react-perf/jsx-no-new-object-as-prop"]
      );
    });
  });

  it("should rename rules to the user's namespace with defineConfig", function() {
    var defineConfig;
    try {
      defineConfig = require("eslint/config").defineConfig;
    } catch {
      // eslint/config was added in ESLint 9.22
      this.skip();
    }
    var config = defineConfig([
      { plugins: { perf: plugin }, extends: ["perf/recommended"] }
    ]);
    var messages = new Linter().verify("<Item prop={{}} />", config, "test.js");
    assert.deepEqual(
      messages.map(function(message) {
        return message.ruleId;
      }),
      ["perf/jsx-no-new-object-as-prop"]
    );
  });
});
