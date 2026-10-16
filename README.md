# eslint-plugin-react-perf-x

[![CI](https://github.com/PavelVanecek/eslint-plugin-react-perf-x/actions/workflows/ci.yml/badge.svg)](https://github.com/PavelVanecek/eslint-plugin-react-perf-x/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/eslint-plugin-react-perf-x)](https://www.npmjs.com/package/eslint-plugin-react-perf-x)

Performance-minded React linting rules for ESLint (motivated by [esamatti](https://twitter.com/esamatti)'s post ["React.js pure render performance anti-pattern"](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f)).

This is a maintained fork of [eslint-plugin-react-perf](https://github.com/cvazac/eslint-plugin-react-perf) by Charles Vazac and contributors. It keeps the same rules and rule IDs (`react-perf/*`), and targets current ESLint: flat config only, ESLint 9 and 10, and bundled TypeScript types. See the [GitHub releases](https://github.com/PavelVanecek/eslint-plugin-react-perf-x/releases) for what changed compared to the original.

# Installation

```sh
npm i -D eslint-plugin-react-perf-x
```

| Requirement | Supported versions |
| ----------- | ------------------ |
| ESLint      | 9, 10              |
| Node.js     | 22 or newer        |
| Config      | flat config only   |

Add the plugin to your `eslint.config.js`:

```js
import reactPerfPlugin from 'eslint-plugin-react-perf-x';

export default [
  {
    plugins: { 'react-perf': reactPerfPlugin },
    rules: {
      'react-perf/jsx-no-new-object-as-prop': 'error'
    }
  }
];
```

## Migrating from eslint-plugin-react-perf

Swap the package and the import. Rule IDs, rule options and the `configs.flat.*` aliases are the same:

```sh
npm rm eslint-plugin-react-perf
npm i -D eslint-plugin-react-perf-x
```

```diff
-import reactPerfPlugin from 'eslint-plugin-react-perf';
+import reactPerfPlugin from 'eslint-plugin-react-perf-x';
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
import reactPerfPlugin from 'eslint-plugin-react-perf-x';

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
import reactPerfPlugin from 'eslint-plugin-react-perf-x';

export default [
  reactPerfPlugin.configs.all
];
```

`configs.flat.recommended` and `configs.flat.all` are also exported as aliases of the configurations above, for drop-in compatibility with eslint-plugin-react-perf.

With `defineConfig`, you can also register the plugin under another name and extend its configurations by string; the rule IDs follow your name:

```js
import { defineConfig } from 'eslint/config';
import reactPerfPlugin from 'eslint-plugin-react-perf-x';

export default defineConfig([
  {
    plugins: { perf: reactPerfPlugin },
    extends: ['perf/recommended'],
    rules: { 'perf/jsx-no-jsx-as-prop': 'error' }
  }
]);
```

## TypeScript

The package ships type definitions, so the plugin and its configurations typecheck in `eslint.config.ts`.

## eslintrc

`.eslintrc` files are not supported. Use flat config (`eslint.config.js`); see the [ESLint migration guide](https://eslint.org/docs/latest/use/configure/migration-guide).

# Test anti-patterns in runtime

Try out [cvazac/test-ref-pattern](https://github.com/cvazac/test-ref-pattern).

# Credits

The rules were written by [Charles Vazac](https://github.com/cvazac), [Valjean Clark](https://github.com/vbud) and the contributors of [eslint-plugin-react-perf](https://github.com/cvazac/eslint-plugin-react-perf).

# License

eslint-plugin-react-perf-x is licensed under the [MIT License](LICENSE).
