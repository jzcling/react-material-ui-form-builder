import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import analyze from "rollup-plugin-analyzer";
import pkg from "./package.json";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import autoExternal from "rollup-plugin-auto-external";

const config = [
  {
    input: {
      index: "src/index.js",
      StandardAutocomplete: "src/Components/Forms/StandardAutocomplete.js",
      StandardAutocompleteNoDrag:
        "src/Components/Forms/StandardAutocompleteNoDrag.js",
      StandardCheckboxGroup: "src/Components/Forms/StandardCheckboxGroup.js",
      StandardChipGroup: "src/Components/Forms/StandardChipGroup.js",
      StandardDatePicker: "src/Components/Forms/StandardDatePicker.js",
      StandardDateTimePicker: "src/Components/Forms/StandardDateTimePicker.js",
      StandardEditor: "src/Components/Forms/StandardEditor.js",
      StandardFileUpload: "src/Components/Forms/StandardFileUpload.js",
      StandardImagePicker: "src/Components/Forms/StandardImagePicker.js",
      StandardRadioGroup: "src/Components/Forms/StandardRadioGroup.js",
      StandardRating: "src/Components/Forms/StandardRating.js",
      StandardSelect: "src/Components/Forms/StandardSelect.js",
      StandardSwitch: "src/Components/Forms/StandardSwitch.js",
      StandardTextField: "src/Components/Forms/StandardTextField.js",
      StandardTimePicker: "src/Components/Forms/StandardTimePicker.js",
      useValidation: "src/Hooks/useValidation.js",
      FormBuilder: "src/Components/FormBuilder.js",
    },
    output: [
      {
        dir: "dist/cjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
      {
        dir: "dist/es",
        format: "es",
        exports: "named",
        sourcemap: true,
      },
    ],
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
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
    external: [/lodash/, /@mui\//, /@babel\/runtime/, "prop-types"],
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
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
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
              libraryName: "@mui/material",
              libraryDirectory: "",
              camel2DashComponentName: false,
            },
            "core",
          ],
          [
            "babel-plugin-import",
            {
              libraryName: "@mui/icons-material",
              libraryDirectory: "",
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
