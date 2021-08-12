import React, { useMemo } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import _ from "lodash";
import { Fragment } from "react";
import useValidation from "../../Hooks/useValidation";
import { getValidations } from "../../Helpers";

function StandardCheckboxGroup(props) {
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

  const handleCheckboxChange = (option, value) => {
    if (field.multiple) {
      if (value) {
        updateForm(field.attribute, [
          ...(_.get(form, field.attribute) || []),
          optionConfig(option).value,
        ]);
      } else {
        const index = (_.get(form, field.attribute) || []).findIndex(
          (value) => value === optionConfig(option).value
        );
        if (index >= 0) {
          var copy = [..._.get(form, field.attribute)];
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
      onChange: (event) => handleCheckboxChange(option, event.target.checked),
      onBlur: (event) => validate(_.get(form, field.attribute)),
      ...field.props,
    };
  };

  const containerProps = (field) => {
    return {
      error: errors.length > 0,
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
}

StandardCheckboxGroup.defaultProps = {
  updateForm: () => {},
};

StandardCheckboxGroup.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardCheckboxGroup;
