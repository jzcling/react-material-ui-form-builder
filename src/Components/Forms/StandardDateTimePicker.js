import React, { forwardRef, Fragment } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import PropTypes from "prop-types";
import { get } from "lodash-es";
import { makeStyles } from "@material-ui/core/styles";
import useValidation from "../../Hooks/useValidation";
import Title from "../Widgets/Title";

const useStyles = makeStyles(() => ({
  picker: {
    marginTop: 0,
    marginBottom: 0,
  },
  pickerInput: {
    paddingRight: 0,
  },
}));

const StandardDateTimePicker = forwardRef((props, ref) => {
  const classes = useStyles();
  const { field, form, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("date", field, form, updateForm);

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      className: classes.picker,
      ampm: false,
      fullWidth: true,
      variant: "inline",
      inputVariant: "outlined",
      margin: "dense",
      format: "dd/MM/yyyy HH:mm:ss",
      label: field.label,
      value: get(form, field.attribute) || null,
      onChange: (value) => {
        if (value) {
          updateForm(field.attribute, format(value, "yyyy-MM-dd HH:mm:ss"));
        }
      },
      KeyboardButtonProps: {
        "aria-label": field.label,
      },
      InputProps: {
        className: classes.pickerInput,
      },
      error: errors?.length > 0,
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
      {showTitle && field.title && <Title field={field} />}
      <div
        ref={(el) => {
          if (el && ref) {
            el.blur = () => validate(get(form, field.attribute));
            ref(el);
          }
        }}
      >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDateTimePicker {...componentProps(field)} />
        </MuiPickersUtilsProvider>
      </div>
    </Fragment>
  );
});

StandardDateTimePicker.displayName = "StandardDateTimePicker";

StandardDateTimePicker.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardDateTimePicker.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export default StandardDateTimePicker;
