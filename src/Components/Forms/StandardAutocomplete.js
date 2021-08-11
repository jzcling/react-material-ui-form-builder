import React, { Fragment, useMemo } from "react";
import { makeStyles, TextField, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import _ from "lodash";
import PropTypes from "prop-types";
import useValidation from "../../Hooks/useValidation";
import { getValidations } from "../../Helpers";

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    "& .MuiFormControl-marginDense": {
      marginTop: 0,
    },
  },
}));

function StandardAutocomplete(props) {
  const classes = useStyles();
  const { field, form, updateForm } = props;
  const { errors, validate } = useValidation("mixed", getValidations(field));

  const optionConfig = useMemo(
    () => (option) => {
      const config = {
        value: option,
        label: option,
      };

      if (!field.optionConfig) {
        return config;
      }

      if (field.optionConfig.value) {
        // This is to account for the quirky behaviour of onChange returning an array
        if (field.props && field.props.multiple && _.isArray(option)) {
          const value = [];
          for (const item of option) {
            if (_.isObject(item)) {
              value.push(_.get(item, field.optionConfig.value));
            } else {
              value.push(item);
            }
          }
          config.value = value;
        } else {
          config.value = _.get(option, field.optionConfig.value);
        }
      }

      if (field.optionConfig.label) {
        // This is to account for the quirky behaviour of onChange returning an array
        if (field.props && field.props.multiple && _.isArray(option)) {
          const label = [];
          for (const item of option) {
            if (_.isObject(item)) {
              label.push(item);
            } else {
              label.push(_.get(item, field.optionConfig.label));
            }
          }
          config.label = label;
        } else {
          config.label = _.get(option, field.optionConfig.label);
        }
      }

      return config;
    },
    [field]
  );

  /* 
  Required to handle quirky behaviour of Autocomplete component
  where it returns the option object when opening the selection box
  and returns the option value upon selection 
  */
  function getLabel(option) {
    if (_.isObject(option)) {
      return String(optionConfig(option).label);
    }
    if ((field.optionConfig || {}).value) {
      const o =
        field.options.find((o) => optionConfig(o).value === option) || {};
      return String(optionConfig(o).label);
    }
    return String(option);
  }

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      size: "small",
      fullWidth: true,
      options: field.options,
      getOptionSelected: (option, value) => {
        /* 
        Required to handle the quirky behaviour of Autocomplete component
        where it returns the value object sometimes and value value sometimes
        */
        return _.isObject(value)
          ? optionConfig(option).value === optionConfig(value).value
          : optionConfig(option).value === value;
      },
      getOptionLabel: (option) => getLabel(option),
      renderInput: (params) => (
        <TextField
          {...params}
          variant="outlined"
          margin="dense"
          inputProps={{
            ...params.inputProps,
            autoComplete: "off", // disable autocomplete and autofill
          }}
          label={field.label}
          error={errors.length > 0}
          helperText={errors[0]}
        />
      ),
      value:
        _.get(form, field.attribute) ||
        (field.props && field.props.multiple ? [] : null),
      onChange: (event, option) => {
        updateForm(field.attribute, optionConfig(option).value);
      },
      onBlur: (event) => validate(_.get(form, field.attribute)),
      className: classes.autocomplete,
      ...field.props,
    };
  };

  return (
    <Fragment>
      {field.title && (
        <Typography {...field.titleProps}>{field.title}</Typography>
      )}
      <Autocomplete {...componentProps(field)} />
    </Fragment>
  );
}

StandardAutocomplete.defaultProps = {
  updateForm: () => {},
};

StandardAutocomplete.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardAutocomplete;
