import { format, parse } from "date-fns";
import React, { forwardRef, Fragment, useCallback, useState } from "react";
import { Controller, ControllerRenderProps, useFormContext } from "react-hook-form";

import { DateRange } from "@mui/icons-material";
import {
  DatePickerProps, DesktopDatePicker, LocalizationProvider, MobileDatePicker
} from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";

import { getTitleProps } from "../utils";
import { CommonFieldProps, DateTimeFieldProps } from "./props/FieldProps";
import { Title, TitleProps } from "./widgets/Title";

interface StandardDatePickerProps extends CommonFieldProps, DateTimeFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  props: DatePickerProps<Date>;
}

const StandardDatePicker = forwardRef(
  (props: { field: StandardDatePickerProps; showTitle: boolean }, ref) => {
    const {
      control,
      getValues,
      setValue,
      trigger,
      formState: { errors },
    } = useFormContext();
    const { field: fieldConfig, showTitle } = props;
    const titleProps: TitleProps = getTitleProps(fieldConfig);
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
        value: value ? parse(value, "yyyy-MM-dd", new Date()) : undefined,
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="open date picker" size="large">
                <DateRange />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            pr: 0,
          },
        },
        open: !!open,
        onClose: () => setOpen(false),
        ...fieldConfig.props,
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
        defaultValue={getValues(fieldConfig.attribute)}
        render={({ field }) => (
          <Fragment>
            {showTitle && titleProps.title && <Title {...titleProps} />}
            <Box ref={ref}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                {component(componentProps(fieldConfig, field.value))}
              </LocalizationProvider>
            </Box>
          </Fragment>
        )}
      />
    );
  }
);

export { StandardDatePicker };
