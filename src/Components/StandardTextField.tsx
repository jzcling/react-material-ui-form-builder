import React, { Fragment } from "react";
import { Controller, ControllerRenderProps, useFormContext } from "react-hook-form";

import { TextField, TextFieldProps } from "@mui/material";

import { getTitleProps } from "../utils";
import { CommonFieldProps } from "./props/FieldProps";
import { Title, TitleProps } from "./widgets/Title";

export interface StandardTextFieldProps extends CommonFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  props?: TextFieldProps;
}

const StandardTextField = (props: {
  field: StandardTextFieldProps;
  showTitle?: boolean;
}) => {
  const {
    control,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext();
  const { field: fieldConfig, showTitle } = props;
  const titleProps: TitleProps = getTitleProps(fieldConfig);

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
    };
  };

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      defaultValue={getValues(fieldConfig.attribute) || ""}
      render={({ field }) => (
        <Fragment>
          {showTitle && fieldConfig.title && <Title field={fieldConfig} />}
          <TextField {...componentProps(fieldConfig, field)} />
        </Fragment>
      )}
    />
  );
};

export { StandardTextField };
