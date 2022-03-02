import get from "lodash/get";
import React, { Fragment, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { FormControl, FormHelperText, InputLabel, Select, SelectProps } from "@mui/material";

import { getTitleProps, shuffleArray } from "../utils";
import { getOptionFromConfig, Option } from "../utils/options";
import { CommonFieldProps, MultiOptionFieldProps } from "./props/FieldProps";
import { Title, TitleProps } from "./widgets/Title";

export interface StandardSelectProps extends CommonFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  props: SelectProps;
  options: MultiOptionFieldProps<string | number>["options"];
  optionConfig?: MultiOptionFieldProps["optionConfig"];
  randomizeOptions?: MultiOptionFieldProps["randomizeOptions"];
}

const StandardSelect = (props: {
  field: StandardSelectProps;
  showTitle: boolean;
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

  const options: Array<Option<string | number>> = useMemo(() => {
    let options = fieldConfig.options || [];
    if (fieldConfig.randomizeOptions) {
      options = shuffleArray(fieldConfig.options || []);
    }
    return options.map((opt) =>
      getOptionFromConfig<string | number>(opt, fieldConfig.optionConfig)
    );
  }, [fieldConfig.options, fieldConfig.optionConfig]);

  const componentProps = (
    fieldConfig: StandardSelectProps,
    value: string | number
  ): SelectProps => {
    return {
      id: fieldConfig.attribute,
      native: true,
      size: "small",
      inputProps: {
        name: fieldConfig.attribute,
        id: fieldConfig.attribute,
      },
      value: value || "",
      onChange: (event) => setValue(fieldConfig.attribute, event.target.value),
      onBlur: () => trigger(fieldConfig.attribute),
      label: fieldConfig.label,
      ...fieldConfig.props,
    };
  };

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      defaultValue={getValues(fieldConfig.attribute) || ""}
      render={({ field }) => (
        <Fragment>
          {showTitle && titleProps.title && <Title {...titleProps} />}
          <FormControl variant="outlined" fullWidth error={errors?.length > 0}>
            <InputLabel
              // size="small"
              htmlFor={fieldConfig.attribute}
            >
              {fieldConfig.label}
            </InputLabel>
            <Select {...componentProps(fieldConfig, field.value)}>
              <option aria-label="None" value="" />
              {options.map((option) => (
                <option key={option.key} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <FormHelperText>{errors[0]}</FormHelperText>
          </FormControl>
        </Fragment>
      )}
    />
  );
};

export { StandardSelect };