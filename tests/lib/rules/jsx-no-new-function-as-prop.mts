import rule from "../../../dist/rules/jsx-no-new-function-as-prop.js";
import { testRule } from "../utils/common.mts";

testRule(
  rule,
  "jsx-no-new-function-as-prop",
  "JSX attribute values should not contain functions created in the same scope",
  "function(){}",
  [
    // FunctionExpression
    { code: "<Item prop={function(){return true}} />", line: 1, column: 13 },
    // ArrowFunctionExpression
    { code: "<Item prop={() => true} />", line: 1, column: 13 },
    // NewExpression
    {
      code: "<Item prop={new Function('a', 'alert(a)')}/>",
      line: 1,
      column: 13,
    },
    // CallExpression
    {
      code: "<Item onClick={this.clickHandler.bind(this)} />",
      line: 1,
      column: 16,
    },
  ],
  [{ code: "<Item onClick={bind(foo)} />" }]
);
