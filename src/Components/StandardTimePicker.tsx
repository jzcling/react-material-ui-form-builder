import { format, parse } from "date-fns";
import React, { Fragment, useCallback, useState } from "react";
import { Controller, ControllerRenderProps, useFormContext } from "react-hook-form";

import { Schedule } from "@mui/icons-material";
import {
  DesktopTimePicker, LocalizationProvider, MobileTimePicker, TimePickerProps
} from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";

import { getTitleProps } from "../utils";
import { CommonFieldProps, DateTimeFieldProps } from "./props/FieldProps";
import { Title, TitleProps } from "./widgets/Title";

interface StandardTimePickerProps extends CommonFieldProps, DateTimeFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  props: TimePickerProps<Date>;
}

const StandardTimePicker = (
  (props: { field: StandardTimePickerProps; showTitle: boolean }) => {
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
        inputFormat: "HH:mm:ss",
        label: fieldConfig.label,
        value: value ? parse(value, "HH:mm:ss", new Date()) : undefined,
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
        open: !!open,
        onClose: () => setOpen(false),
        ...fieldConfig.props,
        onChange: (value) => {
          if (value) {
            try {
              const formatted = format(value, "HH:mm:ss");
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
);

export { StandardTimePicker };
