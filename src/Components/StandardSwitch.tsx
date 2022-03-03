import React, { Fragment } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { FormControl, FormControlLabel, FormHelperText, Switch, SwitchProps } from "@mui/material";

import { CommonFieldProps, SwitchFieldProps } from "./props/FieldProps";
import { Title } from "./widgets/Title";

export interface StandardSwitchProps
  extends CommonFieldProps<"switch">,
    SwitchFieldProps {
  attribute: Required<CommonFieldProps<"switch">>["attribute"];
  label: Required<CommonFieldProps<"switch">>["label"];
}

const StandardSwitch = (props: {
  field: StandardSwitchProps;
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

  const handleSwitchChange = (checked: boolean, value?: unknown) => {
    if (checked) {
      setValue(fieldConfig.attribute, value);
    } else {
      setValue(fieldConfig.attribute, undefined);
    }
  };

  const componentProps = (
    fieldConfig: StandardSwitchProps,
    value?: unknown
  ): SwitchProps => {
    return {
      id: fieldConfig.attribute,
      key: fieldConfig.attribute,
      size: "small",
      color: "primary",
      checked: !!value,
      onChange: (event) => handleSwitchChange(event.target.checked, value),
      onBlur: () => trigger(fieldConfig.attribute),
      ...fieldConfig.props,
    };
  };

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      defaultValue={getValues(fieldConfig.attribute) || false}
      render={({ field }) => (
        <Fragment>
          {!hideTitle && fieldConfig.title && <Title field={fieldConfig} />}
          <FormControl error={!!errors[fieldConfig.attribute]}>
            <FormControlLabel
              key={fieldConfig.attribute}
              control={<Switch {...componentProps(fieldConfig, field.value)} />}
              label={fieldConfig.label}
              sx={{ margin: "8px 0" }}
              {...fieldConfig.labelProps}
            />
            <FormHelperText>
              {errors[fieldConfig.attribute]?.message}
            </FormHelperText>
          </FormControl>
        </Fragment>
      )}
    />
  );
};

export { StandardSwitch };
