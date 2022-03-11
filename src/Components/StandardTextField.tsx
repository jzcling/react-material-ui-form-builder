import React, { Fragment } from "react";
import { Controller, ControllerRenderProps, UseFormReturn } from "react-hook-form";

import { TextField, TextFieldProps } from "@mui/material";

import { CommonFieldProps } from "./props/FieldProps";
import { Title } from "./widgets/Title";

export interface StandardTextFieldProps extends CommonFieldProps<"text-field"> {
  attribute: Required<CommonFieldProps<"text-field">>["attribute"];
}

export default function StandardTextField(props: {
  field: StandardTextFieldProps;
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

  const componentProps = (
    fieldConfig: StandardTextFieldProps,
    field: ControllerRenderProps
  ): TextFieldProps => {
    return {
      id: fieldConfig.attribute,
      fullWidth: true,
      size: "small",
      label: fieldConfig.label,
      error: !!errors[fieldConfig.attribute],
      helperText: errors[fieldConfig.attribute]?.message,
      onKeyDown: (event) => {
        if (event.key === "Enter") {
          trigger(fieldConfig.attribute);
        }
      },
      ...fieldConfig.props,
      ...field,
      value: field.value || "",
    };
  };

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      render={({ field }) => (
        <Fragment>
          {!hideTitle && fieldConfig.title && <Title field={fieldConfig} />}
          <TextField {...componentProps(fieldConfig, field)} />
        </Fragment>
      )}
    />
  );
}
