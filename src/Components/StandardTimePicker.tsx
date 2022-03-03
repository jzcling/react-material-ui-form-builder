import { format, parse } from "date-fns";
import React, { Fragment, useCallback, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Schedule } from "@mui/icons-material";
import {
  DesktopTimePicker, LocalizationProvider, MobileTimePicker, TimePickerProps
} from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";

import { CommonFieldProps, DateTimeFieldProps } from "./props/FieldProps";
import { Title } from "./widgets/Title";

export interface StandardTimePickerProps
  extends CommonFieldProps<"time-picker">,
    DateTimeFieldProps {
  attribute: Required<CommonFieldProps<"time-picker">>["attribute"];
}

const StandardTimePicker = (props: {
  field: StandardTimePickerProps;
  hideTitle?: boolean;
}) => {
  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();
  const { field: fieldConfig, hideTitle } = props;
  const [open, setOpen] = useState<boolean>();

  const component = useCallback(
    (props: TimePickerProps<Date>) => {
      if (fieldConfig.keyboard) {
        return <DesktopTimePicker {...props} />;
      }
      return <MobileTimePicker {...props} />;
    },
    [fieldConfig.keyboard]
  );

  const componentProps = (
    fieldConfig: StandardTimePickerProps,
    value?: string
  ): TimePickerProps<Date> => {
    return {
      ampm: false,
      inputFormat: "HH:mm",
      label: fieldConfig.label,
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="open time picker" size="large">
              <Schedule />
            </IconButton>
          </InputAdornment>
        ),
        sx: {
          pr: fieldConfig.keyboard ? undefined : 0,
        },
      },
      open: !!open,
      onClose: () => setOpen(false),
      ...fieldConfig.props,
      value: value ? parse(value, "HH:mm:ss", new Date()) : undefined,
      onChange: (value) => {
        if (value) {
          try {
            const formatted = format(value, "HH:mm:00");
            setValue(fieldConfig.attribute, formatted);
          } catch (error) {
            console.log(error);
          }
        } else {
          setValue(fieldConfig.attribute, undefined);
        }
      },
      renderInput: (params) => (
        <TextField
          fullWidth
          size="small"
          {...params}
          onClick={() => setOpen(true)}
          error={!!errors[fieldConfig.attribute]}
          helperText={errors[fieldConfig.attribute]?.message}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              trigger(fieldConfig.attribute);
            }
          }}
        />
      ),
    };
  };

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      render={({ field }) => (
        <Fragment>
          {!hideTitle && fieldConfig.title && <Title field={fieldConfig} />}
          <Box>
            <LocalizationProvider dateAdapter={DateAdapter}>
              {component(componentProps(fieldConfig, field.value))}
            </LocalizationProvider>
          </Box>
        </Fragment>
      )}
    />
  );
};

export { StandardTimePicker };
