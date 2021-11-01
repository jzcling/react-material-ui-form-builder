import React, { forwardRef, Fragment, useMemo } from "react";
import { FormControl, FormHelperText, InputLabel, Select } from "@mui/material";
import PropTypes from "prop-types";
import get from "lodash/get";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";
import { shuffleArray } from "../Utils/helpers";

const getValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  return value;
};

const StandardSelect = forwardRef((props, ref) => {
  const { field, value, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("string", field.validations);

  const optionConfig = useMemo(
    () => (option) => {
      const config = {
        key: option,
        value: option,
        label: option,
      };

      if (!field.optionConfig) {
        return config;
      }

      config.key = field.optionConfig.key
        ? get(option, field.optionConfig.key)
        : config.key;
      config.value = field.optionConfig.value
        ? get(option, field.optionConfig.value)
        : config.value;
      config.label = field.optionConfig.label
        ? String(get(option, field.optionConfig.label))
        : config.label;

      return config;
    },
    [field]
  );

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      native: true,
      size: "small",
      inputProps: {
        name: field.attribute,
        id: field.id || field.attribute,
      },
      value: getValue(value),
      onChange: (event) =>
        updateForm({ [field.attribute]: event.target.value }),
      onBlur: () => validate(value),
      label: field.label,
      ...field.props,
    };
  };

  const options = useMemo(() => {
    if (field.randomizeOptions) {
      return shuffleArray(field.options || []);
    }
    return field.options || [];
  }, [field.options]);

  return (
    <Fragment>
      {showTitle && field.title && <Title field={field} />}
      <FormControl variant="outlined" fullWidth error={errors?.length > 0}>
        <InputLabel size="small" htmlFor={field.id || field.attribute}>
          {field.label}
        </InputLabel>
        <Select
          inputRef={(el) => {
            if (el && ref) {
              el.validate = (value) => validate(value);
              ref(el);
            }
          }}
          {...componentProps(field)}
        >
          <option aria-label="None" value="" />
          {options.map((option) => (
            <option
              key={optionConfig(option).key}
              value={optionConfig(option).value}
            >
              {optionConfig(option).label}
            </option>
          ))}
        </Select>
        <FormHelperText>{errors[0]}</FormHelperText>
      </FormControl>
    </Fragment>
  );
});

StandardSelect.displayName = "StandardSelect";

StandardSelect.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardSelect.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardSelect };
