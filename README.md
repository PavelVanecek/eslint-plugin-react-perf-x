# eslint-plugin-react-perf

Performance-minded React linting rules for ESLint (motivated by [esamatti](https://twitter.com/esamatti)'s post ["React.js pure render performance anti-pattern"](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f)).

# Installation

```sh
$ npm i eslint-plugin-react-perf
```

Requires ESLint 9 or 10. Older ESLint versions are not supported or tested.

Add the plugin to your `eslint.config.js`:

```js
import reactPerfPlugin from 'eslint-plugin-react-perf';

export default [
  {
    plugins: { 'react-perf': reactPerfPlugin },
    rules: {
      'react-perf/jsx-no-new-object-as-prop': 'error'
    }
  }
];
```

# List of supported rules

- [react-perf/jsx-no-new-object-as-prop](docs/rules/jsx-no-new-object-as-prop.md): Prevent `{...}` as JSX prop value
- [react-perf/jsx-no-new-array-as-prop](docs/rules/jsx-no-new-array-as-prop.md): Prevent `[...]` as JSX prop value
- [react-perf/jsx-no-new-function-as-prop](docs/rules/jsx-no-new-function-as-prop.md): Prevent `function` as JSX prop value
- [react-perf/jsx-no-jsx-as-prop](docs/rules/jsx-no-jsx-as-prop.md): Prevent JSX as JSX prop value

# Configuration

As of v3.3.0, each eslint-plugin-react-perf rule supports configuration to control whether native elements (lower case first letter React components) are ignored.

With this configuration, all native elements are ignored for this rule:

```json
{
  "react-perf/jsx-no-new-object-as-prop": [
    "error",
    {
      "nativeAllowList": "all"
    }
  ]
}
```

With this configuration, the "style" attribute is ignored for native elements for this rule:

```json
{
  "react-perf/jsx-no-new-object-as-prop": [
    "error",
    {
      "nativeAllowList": ["style"]
    }
  ]
}
```

## Recommended

This plugin exports a `recommended` configuration that enforce React good practices.

To enable this configuration add the following to your eslint.config.js:
```js
import reactPerfPlugin from 'eslint-plugin-react-perf';

export default [
  reactPerfPlugin.configs.recommended
];
```

The rules enabled in this configuration are:

- [react-perf/jsx-no-new-object-as-prop](docs/rules/jsx-no-new-object-as-prop.md)
- [react-perf/jsx-no-new-array-as-prop](docs/rules/jsx-no-new-array-as-prop.md)
- [react-perf/jsx-no-new-function-as-prop](docs/rules/jsx-no-new-function-as-prop.md)

## All

This plugin also exports an `all` configuration that includes every available rule.

```js
import reactPerfPlugin from 'eslint-plugin-react-perf';

export default [
  reactPerfPlugin.configs.all
];
```

`configs.flat.recommended` and `configs.flat.all` are also exported as aliases of the configurations above, for drop-in compatibility with eslint-plugin-react-perf.

With `defineConfig`, you can also register the plugin under another name and extend its configurations by string; the rule IDs follow your name:

```js
import { defineConfig } from 'eslint/config';
import reactPerfPlugin from 'eslint-plugin-react-perf';

export default defineConfig([
  {
    plugins: { perf: reactPerfPlugin },
    extends: ['perf/recommended'],
    rules: { 'perf/jsx-no-jsx-as-prop': 'error' }
  }
]);
```

## TypeScript

The package ships type definitions (`index.d.ts`), so the plugin and its configurations typecheck in `eslint.config.ts`.

## eslintrc

`.eslintrc` files are not supported. Use flat config (`eslint.config.js`); see the [ESLint migration guide](https://eslint.org/docs/latest/use/configure/migration-guide).

# Test anti-patterns in runtime

Try out [cvazac/test-ref-pattern](https://github.com/cvazac/test-ref-pattern).

# License

eslint-plugin-react-perf is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
