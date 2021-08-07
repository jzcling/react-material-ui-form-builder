import React, { useMemo } from "react";
import {
  Radio,
  FormControlLabel,
  FormGroup,
  Typography,
  FormHelperText,
} from "@material-ui/core";
import PropTypes from "prop-types";
import _ from "lodash";
import { Fragment } from "react";
import useValidation from "../../Hooks/useValidation";
import { getValidations } from "../../Helpers";

function StandardRadioGroup(props) {
  const { field, form, updateForm } = props;
  const { errors, validate } = useValidation("mixed", getValidations(field));

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

  const handleRadioChange = (value, checked) => {
    if (checked) {
      updateForm(field.attribute, value);
    }
  };

  const componentProps = (field, option) => {
    var isSelected;
    if (field.multiple) {
      isSelected =
        _.get(form, field.attribute) &&
        _.get(form, field.attribute).includes(optionConfig(option).value);
    } else {
      isSelected = _.get(form, field.attribute) === optionConfig(option).value;
    }
    return {
      id: field.id || field.attribute,
      key: optionConfig(option).key,
      color: "primary",
      checked: isSelected,
      value: optionConfig(option).value,
      onChange: (event) =>
        handleRadioChange(event.target.value, event.target.checked),
      onBlur: (event) => validate(_.get(form, field.attribute)),
      ...field.props,
    };
  };

  const containerProps = (field) => {
    return {
      component: "fieldset",
      ...field.groupContainerProps,
    };
  };

  return (
    <Fragment>
      {field.title && (
        <Typography {...field.titleProps}>{field.title}</Typography>
      )}
      <FormGroup {...containerProps(field)}>
        {(field.options || []).map((option, index) => (
          <FormControlLabel
            key={field.id + "-" + index}
            control={<Radio {...componentProps(field, option)} />}
            label={optionConfig(option).label}
            error={errors.length > 0}
            {...field.labelProps}
          />
        ))}
        <FormHelperText>{errors[0]}</FormHelperText>
      </FormGroup>
    </Fragment>
  );
}

StandardRadioGroup.defaultProps = {
  updateForm: () => {},
};

StandardRadioGroup.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardRadioGroup;
