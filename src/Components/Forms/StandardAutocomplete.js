import React, { useMemo } from "react";
import { makeStyles, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import _ from "lodash";
import PropTypes from "prop-types";

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

  const optionConfig = useMemo(
    () => (option) => {
      const config = {
        value: option,
        label: option,
      };

      if (!field.optionConfig) {
        return config;
      }

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

  // Required to handle quirky behaviour of Autocomplete component
  // where it returns the option object when opening the selection box
  // and returns the option value upon selection
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
      getOptionSelected: (option, value) =>
        // Required to handle the quirky behaviour of Autocomplete component
        // where it returns the value object sometimes and value value sometimes
        _.isObject(value)
          ? optionConfig(option).value === optionConfig(value).value
          : optionConfig(option).value === value,
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
        />
      ),
      value:
        _.get(form, field.attribute) ||
        (field.props && field.props.multiple ? [] : null),
      onChange: (event, option) =>
        updateForm(field.attribute, optionConfig(option).value),
      className: classes.autocomplete,
      ...(field.props || {}),
    };
  };

  return <Autocomplete {...componentProps(field)} />;
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
