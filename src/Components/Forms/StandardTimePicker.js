import React, { Fragment } from "react";
import MomentUtils from "@date-io/moment";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import PropTypes from "prop-types";
import _ from "lodash";
import { makeStyles, Typography } from "@material-ui/core";
import useValidation from "../../Hooks/useValidation";
import { getValidations } from "../../Helpers";

const useStyles = makeStyles((theme) => ({
  picker: {
    marginTop: 0,
    marginBottom: 0,
  },
  pickerInput: {
    paddingRight: 0,
  },
}));

function StandardTimePicker(props) {
  const classes = useStyles();
  const { field, form, updateForm } = props;
  const { errors, validate } = useValidation("date", getValidations(field));

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      className: classes.picker,
      ampm: false,
      fullWidth: true,
      variant: "inline",
      inputVariant: "outlined",
      margin: "dense",
      format: "HH:mm:ss",
      label: field.label,
      value: _.get(form, field.attribute) || null,
      onChange: (value) =>
        updateForm(field.attribute, value.format("HH:mm:ss")),
      KeyboardButtonProps: {
        "aria-label": field.label,
      },
      InputProps: {
        className: classes.pickerInput,
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
        <KeyboardTimePicker {...componentProps(field)} />
      </MuiPickersUtilsProvider>
    </Fragment>
  );
}

StandardTimePicker.defaultProps = {
  updateForm: () => {},
};

StandardTimePicker.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardTimePicker;
