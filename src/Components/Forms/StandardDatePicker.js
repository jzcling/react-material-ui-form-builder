import React, { Fragment } from "react";
import MomentUtils from "@date-io/moment";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import PropTypes from "prop-types";
import _ from "lodash";
import { makeStyles, Typography } from "@material-ui/core";
import { getValidations } from "../../Helpers";
import useValidation from "../../Hooks/useValidation";

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
  const { errors, validate } = useValidation("date", getValidations(field));

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      className: classes.datePicker,
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
      error: errors.length > 0,
      helperText: errors[0],
      onBlur: (event) => validate(_.get(form, field.attribute)),
      onKeyUp: (event) => {
        if (event.key === "Enter") {
          validate(_.get(form, field.attribute));
        }
      },
      ...field.props,
    };
  };

  return (
    <Fragment>
      {field.title && (
        <Typography {...field.titleProps}>{field.title}</Typography>
      )}
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker {...componentProps(field)} />
      </MuiPickersUtilsProvider>
    </Fragment>
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
