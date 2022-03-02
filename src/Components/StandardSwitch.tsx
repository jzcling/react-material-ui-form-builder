import React, { Fragment } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { FormControl, FormControlLabel, FormHelperText, Switch, SwitchProps } from "@mui/material";

import { getTitleProps } from "../utils";
import { CommonFieldProps, SwitchFieldProps } from "./props/FieldProps";
import { Title, TitleProps } from "./widgets/Title";

export interface StandardSwitchProps
  extends CommonFieldProps,
    SwitchFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  label: Required<CommonFieldProps>["label"];
  props: SwitchProps;
}

const StandardSwitch = (props: {
  field: StandardSwitchProps;
  showTitle?: boolean;
}) => {
  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();
  const { field: fieldConfig, showTitle } = props;
  const titleProps: TitleProps = getTitleProps(fieldConfig);

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
          {showTitle && fieldConfig.title && <Title field={fieldConfig} />}
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
