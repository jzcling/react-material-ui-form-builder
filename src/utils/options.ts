import get from "lodash/get";
import isObject from "lodash/isObject";

export interface Option<T> {
  key: string;
  value: T;
  label: string;
}

export interface SelectOption {
  key: string;
  value: string | number;
  label: string;
}

export interface OptionConfig {
  key: string;
  value?: string;
  label: string;
}

export function getOptionFromConfig<T>(
  option: T,
  config?: OptionConfig
): Option<T> {
  if (config) {
    return {
      key: String(get(option, config.key)),
      value: config.value ? get(option, config.value) : option,
      label: String(get(option, config.label)),
    };
  }

  return {
    key: String(option),
    value: <T>option,
    label: String(option),
  };
}

export function getSelectOptionFromConfig<T>(
  option: T,
  config?: OptionConfig
): Option<string | number> {
  if (config) {
    return {
      key: String(get(option, config.key)),
      value: String(config.value ? get(option, config.value) : option),
      label: String(get(option, config.label)),
    };
  }

  return {
    key: String(option),
    value: String(option),
    label: String(option),
  };
}
