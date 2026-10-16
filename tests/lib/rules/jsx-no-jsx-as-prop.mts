import rule from "../../../dist/rules/jsx-no-jsx-as-prop.js";
import { testRule } from "../utils/common.mts";

testRule(
  rule,
  "jsx-no-jsx-as-prop",
  "JSX attribute values should not contain other JSX",
  "<SubItem />",
  [
    // JSXElement
    { code: "<Item prop={<SubItem prop={val}/>} />", line: 1, column: 13 },
    // JSXFragment
    { code: "<Item prop={<>SubItem</>} />", line: 1, column: 13 },
  ]
);
