import get from "lodash/get";
import isObject from "lodash/isObject";

import { shuffleArray } from "./";

export interface AutocompleteOption<T = unknown> {
  value: T;
  label: string;
}

export interface AutocompleteOptionConfig {
  value?: string;
  label: string;
}

export function getOptions(
  options?: Array<unknown | Record<string, unknown>>,
  randomize?: boolean
) {
  let opts = options || [];
  if (randomize) {
    opts = shuffleArray(opts);
  }
  return opts;
}

export function getOptionFromConfig(
  option: unknown | Record<string, unknown>,
  config?: AutocompleteOptionConfig,
  multiple?: boolean
): AutocompleteOption<unknown> {
  const opt: AutocompleteOption = {
    value: option,
    label: String(option),
  };

  if (!config) {
    return opt;
  }

  if (config.value) {
    // This is to account for the quirky behaviour of onChange returning an array
    if (multiple && Array.isArray(option)) {
      const value = [];
      for (const item of option) {
        if (isObject(item)) {
          value.push(get(item, config.value));
        } else {
          value.push(item);
        }
      }
      opt.value = value;
    } else {
      opt.value = get(option, config.value);
    }
  }

  if (config.label) {
    // This is to account for the quirky behaviour of onChange returning an array
    if (multiple && Array.isArray(option)) {
      const label = [];
      for (const item of option) {
        if (isObject(item)) {
          label.push(item);
        } else {
          label.push(get(item, config.label));
        }
      }
      opt.label = String(label);
    } else {
      opt.label = get(option, config.label);
    }
  }

  return opt;
}

/*
  Required to handle quirky behaviour of Autocomplete component
  where it returns the option object when opening the selection box
  and returns the option value upon selection
  */
export function getLabel(
  option: unknown | Record<string, unknown>,
  options: Array<unknown | Record<string, unknown>>,
  config?: AutocompleteOptionConfig
) {
  if (isObject(option)) {
    return getOptionFromConfig(option).label;
  }
  if (config?.value) {
    const o =
      options.find((o) => getOptionFromConfig(o).value === option) || {};
    return getOptionFromConfig(o)?.label;
  }
  return String(option);
}
