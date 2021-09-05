import React, { forwardRef, useMemo } from "react";
import {
  Radio,
  FormControlLabel,
  FormGroup,
  Typography,
  FormHelperText,
  FormControl,
} from "@material-ui/core";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Fragment } from "react";
import useValidation from "../../Hooks/useValidation";

const StandardRadioGroup = forwardRef((props, ref) => {
  const { field, form, updateForm } = props;
  const { errors, validate } = useValidation("mixed", field, form, updateForm);

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

  const handleRadioChange = (value, checked) => {
    if (checked) {
      updateForm(field.attribute, value);
    }
  };

  const componentProps = (field, option) => {
    var isSelected;
    if (field.multiple) {
      isSelected =
        get(form, field.attribute) &&
        get(form, field.attribute).includes(optionConfig(option).value);
    } else {
      isSelected = get(form, field.attribute) === optionConfig(option).value;
    }
    return {
      id: field.id || field.attribute,
      key: optionConfig(option).key,
      color: "primary",
      checked: isSelected,
      value: optionConfig(option).value,
      onChange: (event) =>
        handleRadioChange(event.target.value, event.target.checked),
      ...field.props,
    };
  };

  const containerProps = (field) => {
    return {
      error: errors.length > 0,
      onBlur: () => validate(get(form, field.attribute)),
      ...field.groupContainerProps,
    };
  };

  return (
    <Fragment>
      {field.title && (
        <Typography {...field.titleProps}>{field.title}</Typography>
      )}
      <FormGroup component="fieldset">
        <FormControl {...containerProps(field)}>
          {(field.options || []).map((option, index) => (
            <FormControlLabel
              inputRef={ref}
              key={field.id + "-" + index}
              control={<Radio {...componentProps(field, option)} />}
              label={optionConfig(option).label}
              {...field.labelProps}
            />
          ))}
          <FormHelperText>{errors[0]}</FormHelperText>
        </FormControl>
      </FormGroup>
    </Fragment>
  );
});

StandardRadioGroup.displayName = "StandardRadioGroup";

StandardRadioGroup.defaultProps = {
  updateForm: () => {},
};

StandardRadioGroup.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardRadioGroup;
