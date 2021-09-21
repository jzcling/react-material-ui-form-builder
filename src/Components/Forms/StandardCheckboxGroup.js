import React, { forwardRef, useMemo } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Fragment } from "react";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";
import { shuffleArray } from "../Utils/helpers";

const useStyles = makeStyles((theme) => ({
  errorText: {
    marginTop: "4px",
    fontSize: "0.75rem",
    color: theme.palette.error.main,
  },
}));

const StandardCheckboxGroup = forwardRef((props, ref) => {
  const { field, form, updateForm, showTitle } = props;
  const classes = useStyles();
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
              control={<Checkbox {...componentProps(field, option)} />}
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

StandardCheckboxGroup.displayName = "StandardCheckboxGroup";

StandardCheckboxGroup.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardCheckboxGroup.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardCheckboxGroup };
