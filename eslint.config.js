const js = require("@eslint/js");
const globals = require("globals");

const config = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "space-before-function-paren": 0
    },
  },
  {
    files: ["index.js", "lib/**/*.js"],
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
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.mocha
      }
    }
  }
];

module.exports = config;
