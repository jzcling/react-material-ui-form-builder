import analyze from "rollup-plugin-analyzer";
import autoExternal from "rollup-plugin-auto-external";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import nodePolyfills from "rollup-plugin-polyfill-node";

import pkg from "./package.json";

const config = [
  {
    input: {
      index: "build/index.js",
      StandardAutocomplete: "build/components/StandardAutocomplete.js",
      StandardCheckboxGroup: "build/components/StandardCheckboxGroup.js",
      StandardChipGroup: "build/components/StandardChipGroup.js",
      StandardDatePicker: "build/components/StandardDatePicker.js",
      StandardDateTimePicker: "build/components/StandardDateTimePicker.js",
      StandardEditor: "build/components/StandardEditor.js",
      StandardFileUpload: "build/components/StandardFileUpload.js",
      StandardImagePicker: "build/components/StandardImagePicker.js",
      StandardRadioGroup: "build/components/StandardRadioGroup.js",
      StandardRating: "build/components/StandardRating.js",
      StandardSelect: "build/components/StandardSelect.js",
      StandardSwitch: "build/components/StandardSwitch.js",
      StandardTextField: "build/components/StandardTextField.js",
      StandardTimePicker: "build/components/StandardTimePicker.js",
      FormBuilder: "build/components/FormBuilder.js",
      validationUtils: "build/utils/validation.js",
    },
    output: [
      {
        dir: "dist/es",
        format: "es",
        exports: "named",
        // sourcemap: true,
      },
      {
        dir: "dist/cjs",
        format: "cjs",
        exports: "named",
        // sourcemap: true,
      },
    ],
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      json(),
      resolve(),
      commonjs({
        exclude: ["src/**", "build/**"],
        include: ["node_modules/**"],
      }),
      analyze({ summaryOnly: true, limit: 10 }),
      // sizeSnapshot(),
      // sourcemaps(),
      terser(),
      autoExternal(),
    ],
    external: [/lodash/, /@mui\//],
  },
  {
    input: "build/dts/index.d.ts",
    output: [{ file: "dist/dts/index.d.ts" }],
    plugins: [dts()],
  },
  {
    input: "build/index.js",
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
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      nodePolyfills(),
      json(),
      resolve(),
      commonjs({
        exclude: ["src/**", "build/**"],
        include: ["node_modules/**"],
      }),
      analyze({ summaryOnly: true, limit: 10 }),
      sizeSnapshot(),
      // sourcemaps(),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
];

export default config;
