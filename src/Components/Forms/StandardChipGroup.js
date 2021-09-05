import React, { forwardRef, useMemo } from "react";
import {
  Chip,
  FormControl,
  FormGroup,
  FormHelperText,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Fragment } from "react";
import useValidation from "../../Hooks/useValidation";

const useStyles = makeStyles((theme) => ({
  chip: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}));

const StandardChipGroup = forwardRef((props, ref) => {
  const classes = useStyles();
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

  const handleChipClick = (option) => {
    if (field.multiple) {
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
      updateForm(field.attribute, [
        ...(get(form, field.attribute) || []),
        optionConfig(option).value,
      ]);
    } else {
      if (get(form, field.attribute) === optionConfig(option).value) {
        updateForm(field.attribute, undefined);
        return;
      }
      updateForm(field.attribute, optionConfig(option).value);
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
      className: classes.chip,
      key: optionConfig(option).key,
      size: "small",
      label: optionConfig(option).label,
      color: isSelected ? "primary" : "default",
      variant: isSelected ? "default" : "outlined",
      onClick: () => handleChipClick(option),
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
            <div
              ref={(el) => {
                if (el && ref) {
                  el.blur = () => validate(get(form, field.attribute));
                  ref(el);
                }
              }}
              key={field.id + "-" + index}
            >
              <Chip {...componentProps(field, option)} />
            </div>
          ))}
          <FormHelperText>{errors[0]}</FormHelperText>
        </FormControl>
      </FormGroup>
    </Fragment>
  );
});

StandardChipGroup.displayName = "StandardChipGroup";

StandardChipGroup.defaultProps = {
  updateForm: () => {},
};

StandardChipGroup.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardChipGroup;
