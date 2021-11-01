import React, { forwardRef, Fragment, useCallback } from "react";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { format } from "date-fns";
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
      fullWidth: true,
      inputVariant: "outlined",
      size: "small",
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
      renderInput: (params) => <TextField fullWidth size="small" {...params} />,
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
