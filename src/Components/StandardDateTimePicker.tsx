import { format, parse } from "date-fns";
import React, { Fragment, useCallback, useState } from "react";
import { Controller, ControllerRenderProps, useFormContext } from "react-hook-form";

import { Event } from "@mui/icons-material";
import {
  DateTimePickerProps, DesktopDateTimePicker, LocalizationProvider, MobileDateTimePicker
} from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";

import { getTitleProps } from "../utils";
import { CommonFieldProps, DateTimeFieldProps } from "./props/FieldProps";
import { Title, TitleProps } from "./widgets/Title";

export interface StandardDateTimePickerProps
  extends CommonFieldProps,
    DateTimeFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  props?: DateTimePickerProps<Date>;
}

const StandardDateTimePicker = (props: {
  field: StandardDateTimePickerProps;
  showTitle?: boolean;
}) => {
  const {
    control,
    getValues,
    trigger,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { field: fieldConfig, showTitle } = props;
  const titleProps: TitleProps = getTitleProps(fieldConfig);
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
      inputFormat: "dd/MM/yyyy HH:mm:ss",
      label: fieldConfig.label,
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="open date time picker" size="large">
              <Event />
            </IconButton>
          </InputAdornment>
        ),
        style: {
          paddingRight: 0,
        },
      },
      open: !!open,
      onClose: () => setOpen(false),
      ...fieldConfig.props,
      value: value
        ? parse(value, "yyyy-MM-dd HH:mm:ss", new Date())
        : undefined,
      onChange: (value) => {
        if (value) {
          try {
            const formatted = format(value, "yyyy-MM-dd HH:mm:ss");
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
      defaultValue={getValues(fieldConfig.attribute)}
      render={({ field }) => (
        <Fragment>
          {showTitle && fieldConfig.title && <Title field={fieldConfig} />}
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

export { StandardDateTimePicker };
