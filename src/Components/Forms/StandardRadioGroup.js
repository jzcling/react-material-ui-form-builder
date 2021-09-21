import React, { forwardRef, useMemo } from "react";
import {
  Radio,
  FormControlLabel,
  FormGroup,
  FormControl,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Fragment } from "react";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";
import { getValidationType, shuffleArray } from "../Utils/helpers";

const useStyles = makeStyles((theme) => ({
  errorText: {
    marginTop: "4px",
    fontSize: "0.75rem",
    color: theme.palette.error.main,
  },
}));

const StandardRadioGroup = forwardRef((props, ref) => {
  const { field, form, updateForm, showTitle } = props;
  const classes = useStyles();
  const { errors, validate } = useValidation(
    getValidationType(field),
    field,
    form,
    updateForm
  );

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
      error: errors?.length > 0,
      onBlur: () => validate(get(form, field.attribute)),
      ...field.groupContainerProps,
      style: { flexWrap: "wrap", ...(field.groupContainerProps || {}).style },
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
      <FormGroup component="fieldset">
        <FormControl {...containerProps(field)}>
          {options.map((option, index) => (
            <FormControlLabel
              inputRef={ref}
              key={field.id + "-" + index}
              control={<Radio {...componentProps(field, option)} />}
              label={optionConfig(option).label}
              {...field.labelProps}
            />
          ))}
        </FormControl>
        {errors?.length > 0 && (
          <Typography className={classes.errorText}>{errors[0]}</Typography>
        )}
      </FormGroup>
    </Fragment>
  );
});

StandardRadioGroup.displayName = "StandardRadioGroup";

StandardRadioGroup.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardRadioGroup.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardRadioGroup };
