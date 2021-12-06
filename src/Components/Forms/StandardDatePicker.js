import React, { forwardRef, Fragment, useCallback, useState } from "react";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { format, parse } from "date-fns";
import PropTypes from "prop-types";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { DateRange } from "@mui/icons-material";
import {
  DesktopDatePicker,
  LocalizationProvider,
  MobileDatePicker,
} from "@mui/lab";

const StandardDatePicker = forwardRef((props, ref) => {
  const { field, value, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("date", field.validations);
  const [open, setOpen] = useState();
  const [error, setError] = useState();

  const component = useCallback(
    (props) => {
      if (field.keyboard) {
        return <DesktopDatePicker {...props} />;
      }
      return <MobileDatePicker {...props} />;
    },
    [field.keyboard]
  );

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      sx: { my: 0 },
      inputFormat: "dd/MM/yyyy",
      label: field.label,
      value: value ? parse(value, "yyyy-MM-dd", new Date()) : null,
      onChange: (value) => {
        setError();
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
      onError: (reason, value) => {
        if (reason === "minDate") {
          setError(
            "Date should not be before " +
              format(field.props.minDate, "d MMM yyyy")
          );
        }
        if (reason === "maxDate") {
          setError(
            "Date should not be after " +
              format(field.props.maxDate, "d MMM yyyy")
          );
        }
      },
      renderInput: (params) => (
        <TextField
          fullWidth
          size="small"
          {...params}
          onClick={() => setOpen(true)}
          error={!!error || errors.length > 0}
          helperText={error || errors[0]}
        />
      ),
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="open date picker" size="large">
              <DateRange />
            </IconButton>
          </InputAdornment>
        ),
        style: {
          paddingRight: 0,
        },
      },
      onBlur: () =>
        validate(value ? parse(value, "yyyy-MM-dd", new Date()) : value),
      onKeyDown: (event) => {
        if (event.which === 13) {
          validate(value ? parse(value, "yyyy-MM-dd", new Date()) : value);
        }
      },
      open: !!open,
      onClose: () => setOpen(),
      ...field.props,
    };
  };

  return (
    <Fragment>
      {showTitle && field.title && <Title field={field} />}
      <div
        ref={(el) => {
          if (el && ref) {
            el.validate = (value) =>
              validate(value ? parse(value, "yyyy-MM-dd", new Date()) : value);
            ref(el);
          }
        }}
      >
        <LocalizationProvider dateAdapter={DateAdapter}>
          {component(componentProps(field))}
        </LocalizationProvider>
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
