import type { Linter } from "eslint";
import { defineConfig } from "eslint/config";
import reactPerf = require("../..");

const configs: Linter.Config[] = [
  reactPerf.configs.recommended,
  reactPerf.configs.all,
  reactPerf.configs.flat.recommended,
  {
    plugins: { "react-perf": reactPerf },
    rules: {
      "react-perf/jsx-no-new-object-as-prop": ["error", { nativeAllowList: "all" }],
    },
  },
];

export = defineConfig([
  ...configs,
  {
    plugins: { perf: reactPerf },
    extends: ["perf/recommended"],
    rules: { "perf/jsx-no-jsx-as-prop": "error" },
  },
]);
