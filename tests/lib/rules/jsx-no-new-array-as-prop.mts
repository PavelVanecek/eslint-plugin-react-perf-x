import rule from "../../../dist/rules/jsx-no-new-array-as-prop.js";
import { testRule } from "../utils/common.mts";

testRule(
  rule,
  "jsx-no-new-array-as-prop",
  "JSX attribute values should not contain Arrays created in the same scope",
  "[]",
  [
    // ArrayExpression
    { code: "<Item prop={[1, 2, 3]} />", line: 1, column: 13 },
    // NewExpression
    { code: "<Item prop={new Array} />", line: 1, column: 13 },
    { code: "<Item prop={new Array()} />", line: 1, column: 13 },
    // CallExpression
    { code: "<Item prop={Array()} />", line: 1, column: 13 },
  ]
);
