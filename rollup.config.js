import analyze from "rollup-plugin-analyzer";
import autoExternal from "rollup-plugin-auto-external";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import jsx from "acorn-jsx";
import sourcemaps from "rollup-plugin-sourcemaps";

import pkg from "./package.json";

const config = [
  {
    input: {
      index: "src/index.ts",
      StandardAutocomplete: "src/components/StandardAutocomplete.tsx",
      StandardCheckboxGroup: "src/components/StandardCheckboxGroup.tsx",
      StandardChipGroup: "src/components/StandardChipGroup.tsx",
      StandardDatePicker: "src/components/StandardDatePicker.tsx",
      StandardDateTimePicker: "src/components/StandardDateTimePicker.tsx",
      StandardEditor: "src/components/StandardEditor.tsx",
      StandardFileUpload: "src/components/StandardFileUpload.tsx",
      StandardImagePicker: "src/components/StandardImagePicker.tsx",
      StandardRadioGroup: "src/components/StandardRadioGroup.tsx",
      StandardRating: "src/components/StandardRating.tsx",
      StandardSelect: "src/components/StandardSelect.tsx",
      StandardSwitch: "src/components/StandardSwitch.tsx",
      StandardTextField: "src/components/StandardTextField.tsx",
      StandardTimePicker: "src/components/StandardTimePicker.tsx",
      FormBuilder: "src/components/FormBuilder.tsx",
    },
    output: [
      {
        dir: "dist/es",
        format: "es",
        exports: "named",
        // sourcemap: true,
      },
    ],
    acornInjectPlugins: [jsx()],
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
      typescript({
        declaration: true,
        declarationDir: "dist/es",
        // sourceMap: true,
        // inlineSources: true,
      }),
      analyze({ summaryOnly: true, limit: 10 }),
      sizeSnapshot(),
      // sourcemaps(),
      terser(),
      autoExternal(),
    ],
    external: [/lodash/, /@mui\//],
  },
  {
    input: {
      index: "src/index.ts",
      StandardAutocomplete: "src/components/StandardAutocomplete.tsx",
      StandardCheckboxGroup: "src/components/StandardCheckboxGroup.tsx",
      StandardChipGroup: "src/components/StandardChipGroup.tsx",
      StandardDatePicker: "src/components/StandardDatePicker.tsx",
      StandardDateTimePicker: "src/components/StandardDateTimePicker.tsx",
      StandardEditor: "src/components/StandardEditor.tsx",
      StandardFileUpload: "src/components/StandardFileUpload.tsx",
      StandardImagePicker: "src/components/StandardImagePicker.tsx",
      StandardRadioGroup: "src/components/StandardRadioGroup.tsx",
      StandardRating: "src/components/StandardRating.tsx",
      StandardSelect: "src/components/StandardSelect.tsx",
      StandardSwitch: "src/components/StandardSwitch.tsx",
      StandardTextField: "src/components/StandardTextField.tsx",
      StandardTimePicker: "src/components/StandardTimePicker.tsx",
      FormBuilder: "src/components/FormBuilder.tsx",
    },
    output: [
      {
        dir: "dist/cjs",
        format: "cjs",
        exports: "named",
        // sourcemap: true,
      },
    ],
    acornInjectPlugins: [jsx()],
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
      typescript({
        declaration: true,
        declarationDir: "dist/cjs",
        // sourceMap: true,
        // inlineSources: true,
      }),
      analyze({ summaryOnly: true, limit: 10 }),
      sizeSnapshot(),
      // sourcemaps(),
      terser(),
      autoExternal(),
    ],
    external: [/lodash/, /@mui\//],
  },
  {
    input: "src/index.ts",
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
    acornInjectPlugins: [jsx()],
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
      typescript(),
      analyze({ summaryOnly: true, limit: 10 }),
      sizeSnapshot(),
      // sourcemaps(),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
];

export default config;
