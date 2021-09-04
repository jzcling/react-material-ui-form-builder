import React, { forwardRef, useMemo } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Fragment } from "react";
import useValidation from "../../Hooks/useValidation";

const StandardCheckboxGroup = forwardRef((props, ref) => {
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

  const handleCheckboxChange = (option, value) => {
    if (field.multiple) {
      if (value) {
        updateForm(field.attribute, [
          ...(get(form, field.attribute) || []),
          optionConfig(option).value,
        ]);
      } else {
        const index = (get(form, field.attribute) || []).findIndex(
          (value) => value === optionConfig(option).value
        );
        if (index >= 0) {
          var copy = [...get(form, field.attribute)];
          copy.splice(index, 1);
          if (copy.length === 0) {
            copy = null;
          }
          updateForm(field.attribute, copy);
          return;
        }
      }
    } else {
      if (value) {
        updateForm(field.attribute, optionConfig(option).value);
      } else {
        updateForm(field.attribute, undefined);
      }
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
      onChange: (event) => handleCheckboxChange(option, event.target.checked),
      ...field.props,
    };
  };

  const containerProps = (field) => {
    return {
      error: errors.length > 0,
      onBlur: (event) => validate(get(form, field.attribute)),
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
              control={<Checkbox {...componentProps(field, option)} />}
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

StandardCheckboxGroup.defaultProps = {
  updateForm: () => {},
};

StandardCheckboxGroup.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardCheckboxGroup;
