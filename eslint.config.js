const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("typescript-eslint");
const eslintPlugin = require("eslint-plugin-eslint-plugin").default;
const { defineConfig } = require("eslint/config");

const config = defineConfig(
  { ignores: ["dist/", "reports/"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "space-before-function-paren": 0,
      // `import x = require()` is how CommonJS modules using `export =` are imported
      "@typescript-eslint/no-require-imports": ["error", { allowAsImport: true }]
    },
  },
  {
    files: ["eslint.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      eqeqeq: "error"
    }
  },
  {
    ...eslintPlugin.configs["rules-recommended"],
    files: ["src/rules/**/*.ts"]
  },
  {
    ...eslintPlugin.configs["tests-recommended"],
    files: ["tests/lib/**/*.mts"]
  },
  {
    files: ["tests/**/*.mts"],
    languageOptions: {
      globals: {
        ...globals.mocha
      }
    }
  }
);

module.exports = config;
