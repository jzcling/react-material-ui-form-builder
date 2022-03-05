import React, { Fragment } from "react";
import { Controller, ControllerRenderProps, useFormContext } from "react-hook-form";

import { TextField, TextFieldProps } from "@mui/material";

import { CommonFieldProps } from "./props/FieldProps";
import { Title } from "./widgets/Title";

export interface StandardTextFieldProps extends CommonFieldProps<"text-field"> {
  attribute: Required<CommonFieldProps<"text-field">>["attribute"];
}

const StandardTextField = (props: {
  field: StandardTextFieldProps;
  hideTitle?: boolean;
}) => {
  const {
    control,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext();
  const { field: fieldConfig, hideTitle } = props;

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
      defaultValue = "",
      ...fieldConfig.props,
      ...field,
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
};

export { StandardTextField };
