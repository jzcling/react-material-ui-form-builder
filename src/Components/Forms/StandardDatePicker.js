import React from "react";
import MomentUtils from "@date-io/moment";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import PropTypes from "prop-types";
import _ from "lodash";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  datePicker: {
    marginTop: 0,
    marginBottom: 0,
  },
  datePickerInput: {
    paddingRight: 0,
  },
}));

function StandardDatePicker(props) {
  const classes = useStyles();
  const { field, form, updateForm } = props;

  const componentProps = (field) => {
    return {
      className: classes.datePicker,
      disableToolbar: true,
      fullWidth: true,
      variant: "inline",
      inputVariant: "outlined",
      margin: "dense",
      format: "DD/MM/YYYY",
      label: field.label,
      value: _.get(form, field.attribute) || null,
      onChange: (value) =>
        updateForm(field.attribute, value.format("YYYY-MM-DD")),
      KeyboardButtonProps: {
        "aria-label": field.label,
      },
      InputProps: {
        className: classes.datePickerInput,
      },
      ...(field.props || {}),
    };
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDatePicker
        id={field.id || field.attribute}
        {...componentProps(field)}
      />
    </MuiPickersUtilsProvider>
  );
}

StandardDatePicker.defaultProps = {
  updateForm: () => {},
};

StandardDatePicker.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardDatePicker;
