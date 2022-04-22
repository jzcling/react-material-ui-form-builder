import get from "lodash/get";
import React, { Fragment, useMemo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import { FormControl, FormHelperText, InputLabel, Select, SelectProps } from "@mui/material";

import { shuffleArray } from "../utils";
import { getSelectOptionFromConfig, SelectOption } from "../utils/options";
import { CommonFieldProps, MultiOptionFieldProps } from "./props/FieldProps";
import { Title } from "./widgets/Title";

export interface StandardSelectProps<TOption>
  extends CommonFieldProps<"select", TOption> {
  attribute: Required<CommonFieldProps<"select", TOption>>["attribute"];
  options: MultiOptionFieldProps<TOption>["options"];
  optionConfig?: MultiOptionFieldProps<TOption>["optionConfig"];
  randomizeOptions?: MultiOptionFieldProps<TOption>["randomizeOptions"];
}

export default function StandardSelect<TOption>(props: {
  field: StandardSelectProps<TOption>;
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

  const options: Array<SelectOption> = useMemo(() => {
    let options = fieldConfig.options || [];
    if (fieldConfig.randomizeOptions) {
      options = shuffleArray(fieldConfig.options || []);
    }
    return options.map((opt) =>
      getSelectOptionFromConfig(opt, fieldConfig.optionConfig)
    );
  }, [fieldConfig.options, fieldConfig.optionConfig]);

  const componentProps = (
    fieldConfig: StandardSelectProps<TOption>,
    value: string | number
  ): SelectProps => {
    return {
      id: fieldConfig.id || fieldConfig.attribute,
      native: true,
      size: "small",
      inputProps: {
        name: fieldConfig.attribute,
        id: fieldConfig.id || fieldConfig.attribute,
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
      render={({ field }) => (
        <Fragment>
          {!hideTitle && fieldConfig.title && <Title field={fieldConfig} />}
          <FormControl
            variant="outlined"
            fullWidth
            error={!!get(errors, fieldConfig.attribute)}
          >
            <InputLabel
              sx={{
                // this is to set the label position correctly.
                // size is currently not a prop for InputLabel
                top: "-8px",
              }}
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
            <FormHelperText>
              {get(errors, fieldConfig.attribute)?.message}
            </FormHelperText>
          </FormControl>
        </Fragment>
      )}
    />
  );
}
