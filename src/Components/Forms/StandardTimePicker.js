import React, { forwardRef, Fragment, useCallback, useState } from "react";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { format, parse } from "date-fns";
import PropTypes from "prop-types";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Schedule } from "@mui/icons-material";
import {
  DesktopTimePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/lab";
import ErrorText from "../Widgets/ErrorText";

const StandardTimePicker = forwardRef((props, ref) => {
  const { field, value, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("date", field.validations);
  const [open, setOpen] = useState();

  const component = useCallback(
    (props) => {
      if (field.keyboard) {
        return <DesktopTimePicker {...props} />;
      }
      return <MobileTimePicker {...props} />;
    },
    [field.keyboard]
  );

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      sx: {
        my: 0,
      },
      ampm: false,
      inputFormat: "HH:mm:ss",
      label: field.label,
      value: value ? parse(value, "yyyy-MM-dd HH:mm:ss", new Date()) : null,
      onChange: (value) => {
        if (value) {
          try {
            const formatted = format(value, "HH:mm:ss");
            updateForm({ [field.attribute]: formatted });
          } catch (error) {
            console.log(error);
          }
        } else {
          updateForm({ [field.attribute]: undefined });
        }
      },
      renderInput: (params) => (
        <TextField
          fullWidth
          size="small"
          {...params}
          onClick={() => setOpen(true)}
        />
      ),
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="open time picker" size="large">
              <Schedule />
            </IconButton>
          </InputAdornment>
        ),
        style: {
          paddingRight: 0,
        },
      },
      error: errors?.length > 0,
      helperText: errors[0],
      onBlur: () => validate(value),
      onKeyDown: (event) => {
        if (event.which === 13) {
          validate(value);
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
            el.validate = (value) => validate(value);
            ref(el);
          }
        }}
      >
        <LocalizationProvider dateAdapter={DateAdapter}>
          {component(componentProps(field))}
        </LocalizationProvider>
      </div>
      {errors?.length > 0 && <ErrorText error={errors[0]} />}
    </Fragment>
  );
});

StandardTimePicker.displayName = "StandardTimePicker";

StandardTimePicker.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardTimePicker.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.any,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardTimePicker };
