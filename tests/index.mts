import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { Linter } from "eslint";
// Self-reference by package name, so the "exports" map is exercised too.
import plugin from "eslint-plugin-react-perf-x";

const rulesDir = path.resolve(import.meta.dirname, "../dist/rules");

const ruleFiles = fs
  .readdirSync(rulesDir)
  .filter((f) => f.endsWith(".js"))
  .map((f) => path.basename(f, ".js"));

const configs: Record<string, Linter.Config> = {
  recommended: plugin.configs.recommended,
  all: plugin.configs.all,
};

describe("all rule files should be exported by the plugin", () => {
  for (const ruleName of ruleFiles) {
    it(`should export ${ruleName}`, async () => {
      const { default: rule } = await import(path.join(rulesDir, `${ruleName}.js`));
      assert.equal(plugin.rules[ruleName as keyof typeof plugin.rules], rule);
    });
  }
});

function assertAllRulesAsError(rules: Linter.Config["rules"]) {
  assert(rules);
  for (const [configName, severity] of Object.entries(rules)) {
    assert.equal(configName.indexOf("react-perf/"), 0);
    assert.equal(severity, 2);
  }
  for (const ruleName of ruleFiles) {
    assert(Boolean(rules[`react-perf/${ruleName}`]));
  }
}

describe("configurations", () => {
  it("should export a flat 'all' configuration", () => {
    assert.equal(plugin.configs.all.plugins?.["react-perf"], plugin);
    assertAllRulesAsError(plugin.configs.all.rules);
  });

  it("should export a flat 'recommended' configuration", () => {
    assert.equal(plugin.configs.recommended.plugins?.["react-perf"], plugin);
    assert.deepEqual(plugin.configs.recommended.languageOptions?.parserOptions, {
      ecmaFeatures: { jsx: true },
    });
  });

  it("should keep configs.flat as aliases", () => {
    assert.equal(plugin.configs.flat.all, plugin.configs.all);
    assert.equal(plugin.configs.flat.recommended, plugin.configs.recommended);
  });

  it("should not export eslintrc configurations", () => {
    for (const config of Object.values(configs)) {
      assert.equal(Array.isArray(config.plugins), false);
    }
  });

  for (const configName of Object.keys(configs)) {
    it(`should lint with the flat '${configName}' configuration`, () => {
      const linter = new Linter();
      const messages = linter.verify(
        "<Item prop={{}} />",
        [configs[configName]],
        "test.js"
      );
      assert.deepEqual(
        messages.map((message) => message.ruleId),
        ["react-perf/jsx-no-new-object-as-prop"]
      );
    });
  }

  it("should rename rules to the user's namespace with defineConfig", async function () {
    let defineConfig: typeof import("eslint/config").defineConfig;
    try {
      ({ defineConfig } = await import("eslint/config"));
    } catch {
      // eslint/config was added in ESLint 9.22
      this.skip();
    }
    const config = defineConfig([
      { plugins: { perf: plugin }, extends: ["perf/recommended"] },
    ]);
    const messages = new Linter().verify("<Item prop={{}} />", config, "test.js");
    assert.deepEqual(
      messages.map((message) => message.ruleId),
      ["perf/jsx-no-new-object-as-prop"]
    );
  });
});
