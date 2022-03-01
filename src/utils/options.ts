import get from "lodash/get";

export interface Option {
  key: string;
  value: unknown;
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

export function getOptionFromConfig(
  option: unknown | Record<string, unknown>,
  config?: OptionConfig
): Option {
  if (config) {
    return {
      key: String(get(option, config.key)),
      value: get(option, config.value),
      label: String(get(option, config.label)),
    };
  }

  if (instanceOfOption(option)) {
    return {
      key: String((option as Option).key),
      value: (option as Option).value,
      label: String((option as Option).label),
    };
  }

  return {
    key: String(option),
    value: option,
    label: String(option),
  };
}
