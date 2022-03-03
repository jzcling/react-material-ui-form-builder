import get from "lodash/get";
import isObject from "lodash/isObject";

import { shuffleArray } from "./";

export type AutocompleteOption<T> = T | Array<T>;

export interface AutocompleteOptionConfig {
  value?: string;
  label: string;
}

export function getOptions<T>(options?: Array<T>, randomize?: boolean) {
  let opts = options || [];
  if (randomize) {
    opts = shuffleArray(opts);
  }
  return opts;
}

export function getOptionFromConfig<T>(
  option: T | Array<T>,
  config?: AutocompleteOptionConfig,
  multiple?: boolean
): AutocompleteOption<T> {
  let opt: AutocompleteOption<T> = option;

  if (!config) {
    return opt;
  }

  if (config.value) {
    // This is to account for the quirky behaviour of onChange returning an array
    if (multiple && Array.isArray(option)) {
      const value: Array<T> = [];
      for (const item of option) {
        if (isObject(item)) {
          value.push(get(item, config.value));
        } else {
          value.push(item);
        }
      }
      opt = value;
    } else {
      opt = get(option, config.value);
    }
  }

  return opt;
}

/*
  Required to handle quirky behaviour of Autocomplete component
  where it returns the option object when opening the selection box
  and returns the option value upon selection
  */
export function getLabel<T>(
  option: T,
  options: Array<T>,
  config?: AutocompleteOptionConfig,
  multiple?: boolean
) {
  // if not config, options must be primitive
  if (!config) {
    return String(option);
  }
  if (isObject(option)) {
    return String(get(option, config.label));
  }
  // if option is not an object, get option by value
  // then get the label based on config
  if (config?.value) {
    const o =
      options.find(
        (o) => getOptionFromConfig(o, config, multiple) === option
      ) || {};
    return String(get(o, config.label));
  }
  // if all else fails, return option as string
  return String(option || "");
}
