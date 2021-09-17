import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import analyze from "rollup-plugin-analyzer";
import pkg from "./package.json";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import autoExternal from "rollup-plugin-auto-external";

const config = [
  {
    input: "src/index.js",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: "es",
        exports: "named",
        sourcemap: true,
      },
    ],
    plugins: [
      json(),
      resolve(),
      commonjs({
        exclude: ["src/**"],
        include: ["node_modules/**"],
      }),
      babel({
        babelHelpers: "runtime",
        exclude: "node_modules/**",
        plugins: [
          [
            "@babel/plugin-proposal-decorators",
            {
              legacy: true,
            },
          ],
          "@babel/plugin-proposal-function-sent",
          "@babel/plugin-proposal-export-namespace-from",
          "@babel/plugin-proposal-numeric-separator",
          "@babel/plugin-proposal-throw-expressions",
          "@babel/plugin-transform-runtime",
          [
            "transform-react-remove-prop-types",
            {
              removeImport: true,
            },
          ],
        ],
        presets: ["@babel/react", "@babel/env"],
        comments: false,
      }),
      analyze({ summaryOnly: true, limit: 10 }),
      sizeSnapshot(),
      terser(),
      autoExternal(),
    ],
    external: [
      "lodash/cloneDeep",
      "lodash/concat",
      "lodash/get",
      "lodash/isArray",
      "lodash/isEqual",
      "lodash/isObject",
      "lodash/isString",
      "lodash/set",
      "lodash/unset",
      "@material-ui/core/styles",
      "clsx",
      /@babel\/runtime/,
    ],
  },
  {
    input: "src/index.js",
    output: [
      {
        file: `dist/${pkg.name}.min.js`,
        format: "umd",
        name: "FormBuilder",
        exports: "named",
        sourcemap: true,
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    ],
    plugins: [
      json(),
      resolve(),
      commonjs({
        exclude: ["src/**"],
        include: ["node_modules/**"],
      }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        plugins: [
          [
            "@babel/plugin-proposal-decorators",
            {
              legacy: true,
            },
          ],
          "@babel/plugin-proposal-function-sent",
          "@babel/plugin-proposal-export-namespace-from",
          "@babel/plugin-proposal-numeric-separator",
          "@babel/plugin-proposal-throw-expressions",
          [
            "transform-react-remove-prop-types",
            {
              removeImport: true,
            },
          ],
          "babel-plugin-lodash",
          [
            "babel-plugin-import",
            {
              libraryName: "@material-ui/core",
              libraryDirectory: "esm",
              camel2DashComponentName: false,
            },
            "core",
          ],
          [
            "babel-plugin-import",
            {
              libraryName: "@material-ui/icons",
              libraryDirectory: "esm",
              camel2DashComponentName: false,
            },
            "icons",
          ],
        ],
        presets: ["@babel/react", "@babel/env"],
        comments: false,
      }),
      analyze({ summaryOnly: true, limit: 10 }),
      sizeSnapshot(),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
];

export default config;
