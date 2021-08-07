import React, { Fragment, useMemo } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import _ from "lodash";
import { getValidations } from "../../Helpers";
import useValidation from "../../Hooks/useValidation";

const getValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  return value;
};

function StandardSelect(props) {
  const { field, form, updateForm } = props;
  const { errors, validate } = useValidation("string", getValidations(field));

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
        ? _.get(option, field.optionConfig.key)
        : config.key;
      config.value = field.optionConfig.value
        ? _.get(option, field.optionConfig.value)
        : config.value;
      config.label = field.optionConfig.label
        ? String(_.get(option, field.optionConfig.label))
        : config.label;

      return config;
    },
    [field]
  );

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      native: true,
      margin: "dense",
      inputProps: {
        name: field.attribute,
        id: field.id || field.attribute,
      },
      value: getValue(_.get(form, field.attribute)),
      onChange: (event) => updateForm(field.attribute, event.target.value),
      onBlur: (event) => validate(_.get(form, field.attribute)),
      label: field.label,
      ...field.props,
    };
  };

  return (
    <Fragment>
      {field.title && (
        <Typography {...field.titleProps}>{field.title}</Typography>
      )}
      <FormControl variant="outlined" fullWidth error={errors.length > 0}>
        <InputLabel margin="dense" htmlFor={field.id || field.attribute}>
          {field.label}
        </InputLabel>
        <Select {...componentProps(field)}>
          <option aria-label="None" value="" />
          {(field.options || []).map((option) => (
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
}

StandardSelect.defaultProps = {
  updateForm: () => {},
};

StandardSelect.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardSelect;
