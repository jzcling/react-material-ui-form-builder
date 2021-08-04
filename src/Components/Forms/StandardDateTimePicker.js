import React, { Fragment } from "react";
import MomentUtils from "@date-io/moment";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import PropTypes from "prop-types";
import _ from "lodash";
import { makeStyles, Typography } from "@material-ui/core";

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
      id: field.id || field.attribute,
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
    <Fragment>
      {field.title && (
        <Typography {...field.titleProps}>{field.title}</Typography>
      )}
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDateTimePicker {...componentProps(field)} />
      </MuiPickersUtilsProvider>
    </Fragment>
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
