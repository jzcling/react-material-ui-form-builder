import { format, parse } from "date-fns";
import React, { Fragment, useCallback, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import { DateRange } from "@mui/icons-material";
import {
  DatePickerProps, DesktopDatePicker, LocalizationProvider, MobileDatePicker
} from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";

import { CommonFieldProps, DateTimeFieldProps } from "./props/FieldProps";
import { Title } from "./widgets/Title";

export interface StandardDatePickerProps
  extends CommonFieldProps<"date-picker">,
    DateTimeFieldProps {
  attribute: Required<CommonFieldProps<"date-picker">>["attribute"];
}

export default function StandardDatePicker(props: {
  field: StandardDatePickerProps;
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
    (props: DatePickerProps<Date>) => {
      if (fieldConfig.keyboard) {
        return <DesktopDatePicker {...props} />;
      }
      return <MobileDatePicker {...props} />;
    },
    [fieldConfig.keyboard]
  );

  const componentProps = (
    fieldConfig: StandardDatePickerProps,
    value?: string
  ): DatePickerProps<Date> => {
    return {
      inputFormat: "dd/MM/yyyy",
      label: fieldConfig.label,
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="open date picker" size="large">
              <DateRange />
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
      value: value ? parse(value, "yyyy-MM-dd", new Date()) : null,
      onChange: (value) => {
        if (value) {
          try {
            const formatted = format(value, "yyyy-MM-dd");
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
}
