import rule from "../../../dist/rules/jsx-no-new-object-as-prop.js";
import { testRule } from "../utils/common.mts";

testRule(
  rule,
  "jsx-no-new-object-as-prop",
  "JSX attribute values should not contain objects created in the same scope",
  "{}",
  [
    // ObjectExpression
    { code: "<Item prop={{foo: 123}} />", line: 1, column: 13 },
    // NewExpression
    { code: "<Item prop={new Object} />", line: 1, column: 13 },
    { code: "<Item prop={new Object()} />", line: 1, column: 13 },
    // CallExpression
    { code: "<Item prop={Object()} />", line: 1, column: 13 },
  ]
);
