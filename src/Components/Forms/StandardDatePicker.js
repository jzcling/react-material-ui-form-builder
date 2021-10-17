import React, { forwardRef, Fragment, useCallback } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import {
  DatePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";
import { IconButton, InputAdornment } from "@material-ui/core";
import { DateRange } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  picker: {
    marginTop: 0,
    marginBottom: 0,
  },
  pickerInput: {
    paddingRight: 0,
  },
}));

const StandardDatePicker = forwardRef((props, ref) => {
  const classes = useStyles();
  const { field, value, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("date", field);

  const component = useCallback(
    (props) => {
      if (field.keyboard) {
        return <KeyboardDatePicker {...props} />;
      }
      return <DatePicker {...props} />;
    },
    [field.keyboard]
  );

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      className: classes.picker,
      fullWidth: true,
      inputVariant: "outlined",
      margin: "dense",
      format: "dd/MM/yyyy",
      label: field.label,
      value: value || null,
      onChange: (value) => {
        if (value) {
          try {
            const formatted = format(value, "yyyy-MM-dd");
            updateForm({ [field.attribute]: formatted });
          } catch (error) {
            console.log(error);
          }
        } else {
          updateForm({ [field.attribute]: undefined });
        }
      },
      KeyboardButtonProps: {
        "aria-label": field.label,
      },
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="open date picker">
              <DateRange />
            </IconButton>
          </InputAdornment>
        ),
        classes: {
          adornedEnd: classes.pickerInput,
        },
      },
      keyboardIcon: <DateRange />,
      error: errors?.length > 0,
      helperText: errors[0],
      onBlur: () => validate(value),
      onKeyDown: (event) => {
        if (event.which === 13) {
          validate(value);
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
            el.validate = (value) => validate(value);
            ref(el);
          }
        }}
      >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {component(componentProps(field))}
        </MuiPickersUtilsProvider>
      </div>
    </Fragment>
  );
});

StandardDatePicker.displayName = "StandardDatePicker";

StandardDatePicker.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardDatePicker.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.any,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardDatePicker };
