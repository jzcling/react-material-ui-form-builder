import get from "lodash/get";
import isObject from "lodash/isObject";

export interface Option<T = unknown> {
  key: string;
  value: T;
  label: string;
}

export interface OptionConfig {
  key: string;
  value?: string;
  label: string;
}

export function getOptionFromConfig<T = unknown>(
  option: T | Record<string, T>,
  config?: OptionConfig
): Option<T> {
  if (config) {
    return {
      key: String(get(option, config.key)),
      value: config.value ? get(option, config.value) : option,
      label: String(get(option, config.label)),
    };
  }

  if (isObject(option) && option.value) {
    return {
      key: String(option.key),
      value: option.value,
      label: String(option.label),
    };
  }

  return {
    key: String(option),
    value: <T>option,
    label: String(option),
  };
}
