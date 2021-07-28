import React, { useMemo } from "react";
import { FormControl, makeStyles, TextField } from "@material-ui/core";
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

  const optionConfig = useMemo(() => {
    const config = {
      key: "id",
      label: "name",
    };

    if (!field.optionConfig) {
      return config;
    }

    config.key = field.optionConfig.key || config.key;
    config.label = field.optionConfig.label || config.label;

    return config;
  }, [field]);

  const componentProps = (field) => {
    return {
      size: "small",
      options:
        field.props && field.props.multiple
          ? field.options.map((option) => option[optionConfig.key])
          : field.options,
      getOptionSelected: (option, value) =>
        (_.isString(option) || _.isInteger(option)
          ? option
          : _.get(option, optionConfig.key) || "") === value,
      getOptionLabel: (option) =>
        _.isString(option)
          ? option
          : _.isNumber(option)
          ? (field.options.find((item) => item.id === option) || {})[
              optionConfig.label
            ] || ""
          : option[optionConfig.label],
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
        (field.props && field.props.multiple ? [] : ""),
      onChange: (event, value) => {
        updateForm(
          field.attribute,
          _.isString(value) ? value : _.get(value, optionConfig.key) || value
        );
      },
      className: classes.autocomplete,
      ...(field.props || {}),
    };
  };

  return (
    <FormControl variant="outlined" fullWidth>
      <Autocomplete
        id={field.id || field.attribute}
        {...componentProps(field)}
      />
    </FormControl>
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
