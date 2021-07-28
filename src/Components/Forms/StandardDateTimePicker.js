import React from "react";
import MomentUtils from "@date-io/moment";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import PropTypes from "prop-types";
import _ from "lodash";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  picker: {
    marginTop: 0,
    marginBottom: 0,
  },
  pickerInput: {
    paddingRight: 0,
  },
}));

function StandardDateTimePicker(props) {
  const classes = useStyles();
  const { field, form, updateForm } = props;

  const componentProps = (field) => {
    return {
      className: classes.picker,
      ampm: false,
      fullWidth: true,
      variant: "inline",
      inputVariant: "outlined",
      margin: "dense",
      format: "DD/MM/YYYY HH:mm:ss",
      label: field.label,
      value: _.get(form, field.attribute) || null,
      onChange: (value) =>
        updateForm(field.attribute, value.format("YYYY-MM-DD HH:mm:ss")),
      KeyboardButtonProps: {
        "aria-label": field.label,
      },
      InputProps: {
        className: classes.pickerInput,
      },
      ...(field.props || {}),
    };
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDateTimePicker
        id={field.id || field.attribute}
        {...componentProps(field)}
      />
    </MuiPickersUtilsProvider>
  );
}

StandardDateTimePicker.defaultProps = {
  updateForm: () => {},
};

StandardDateTimePicker.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardDateTimePicker;
