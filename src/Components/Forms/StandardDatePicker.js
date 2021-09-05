import React, { forwardRef, Fragment } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useValidation from "../../Hooks/useValidation";

const useStyles = makeStyles(() => ({
  datePicker: {
    marginTop: 0,
    marginBottom: 0,
  },
  datePickerInput: {
    paddingRight: 0,
  },
}));

const StandardDatePicker = forwardRef((props, ref) => {
  const classes = useStyles();
  const { field, form, updateForm } = props;
  const { errors, validate } = useValidation("date", field, form, updateForm);

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      className: classes.datePicker,
      fullWidth: true,
      variant: "inline",
      inputVariant: "outlined",
      margin: "dense",
      format: "dd/MM/yyyy",
      label: field.label,
      value: get(form, field.attribute) || null,
      onChange: (value) => {
        if (value) {
          updateForm(field.attribute, format(value, "yyyy-MM-dd"));
        }
      },
      KeyboardButtonProps: {
        "aria-label": field.label,
      },
      InputProps: {
        className: classes.datePickerInput,
      },
      error: errors.length > 0,
      helperText: errors[0],
      onBlur: () => validate(get(form, field.attribute)),
      onKeyUp: (event) => {
        if (event.key === "Enter") {
          validate(get(form, field.attribute));
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
      <div
        ref={(el) => {
          if (el && ref) {
            el.blur = () => validate(get(form, field.attribute));
            ref(el);
          }
        }}
      >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker {...componentProps(field)} />
        </MuiPickersUtilsProvider>
      </div>
    </Fragment>
  );
});

StandardDatePicker.displayName = "StandardDatePicker";

StandardDatePicker.defaultProps = {
  updateForm: () => {},
};

StandardDatePicker.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardDatePicker;
