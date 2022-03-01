import get from "lodash/get";

export interface Option<T = unknown> {
  key: string;
  value: T;
  label: string;
}

export interface OptionConfig {
  key?: string;
  value: string;
  label: string;
}

function instanceOfOption(object: any): object is Option {
  return "key" in object && "value" in object && "label" in object;
}

export function getOptionFromConfig<T = unknown>(
  option: T | Record<string, T>,
  config?: OptionConfig
): Option<T> {
  if (config) {
    return {
      key: String(get(option, config.key || config.label)),
      value: get(option, config.value),
      label: String(get(option, config.label)),
    };
  }

  if (instanceOfOption(option)) {
    return {
      key: String((option as Option<T>).key),
      value: (option as Option<T>).value,
      label: String((option as Option<T>).label),
    };
  }

  return {
    key: String(option),
    value: <T>option,
    label: String(option),
  };
}
