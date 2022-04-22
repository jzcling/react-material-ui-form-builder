import { format, parse } from "date-fns";
import get from "lodash/get";
import React, { Fragment, useCallback, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import { Event } from "@mui/icons-material";
import {
  DateTimePickerProps, DesktopDateTimePicker, LocalizationProvider, MobileDateTimePicker
} from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";

import { CommonFieldProps, DateTimeFieldProps } from "./props/FieldProps";
import { Title } from "./widgets/Title";

export interface StandardDateTimePickerProps
  extends CommonFieldProps<"date-time-picker">,
    DateTimeFieldProps {
  attribute: Required<CommonFieldProps<"date-time-picker">>["attribute"];
}

export default function StandardDateTimePicker(props: {
  field: StandardDateTimePickerProps;
  methods: UseFormReturn;
  hideTitle?: boolean;
}) {
  const {
    field: fieldConfig,
    methods: {
      control,
      getValues,
      setValue,
      trigger,
      formState: { errors },
    },
    hideTitle,
  } = props;
  const [open, setOpen] = useState<boolean>();

  const component = useCallback(
    (props: DateTimePickerProps<Date>) => {
      if (fieldConfig.keyboard) {
        return <DesktopDateTimePicker {...props} />;
      }
      return <MobileDateTimePicker {...props} />;
    },
    [fieldConfig.keyboard]
  );

  const componentProps = (
    fieldConfig: StandardDateTimePickerProps,
    value?: string
  ): DateTimePickerProps<Date> => {
    return {
      ampm: false,
      inputFormat: "dd/MM/yyyy HH:mm",
      label: fieldConfig.label,
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="open date time picker" size="large">
              <Event />
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
      value: value ? parse(value, "yyyy-MM-dd HH:mm:ss", new Date()) : null,
      onChange: (value) => {
        if (value) {
          try {
            const formatted = format(value, "yyyy-MM-dd HH:mm:00");
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
          error={!!get(errors, fieldConfig.attribute)}
          helperText={get(errors, fieldConfig.attribute)?.message}
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
}
