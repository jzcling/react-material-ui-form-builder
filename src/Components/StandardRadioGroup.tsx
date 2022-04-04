import isEqual from "lodash/isEqual";
import React, { Fragment, useMemo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import {
  FormControl, FormControlLabel, FormControlProps, FormGroup, Radio, RadioProps, Typography
} from "@mui/material";

import { shuffleArray } from "../utils";
import { getOptionFromConfig, Option } from "../utils/options";
import { CommonFieldProps, MultiOptionFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title } from "./widgets/Title";

export interface StandardRadioGroupProps<TOption>
  extends CommonFieldProps<"radio-group", TOption> {
  attribute: Required<CommonFieldProps<"radio-group", TOption>>["attribute"];
  options: MultiOptionFieldProps<TOption>["options"];
  optionConfig?: MultiOptionFieldProps<TOption>["optionConfig"];
  randomizeOptions?: MultiOptionFieldProps<TOption>["randomizeOptions"];
  labelProps?: MultiOptionFieldProps<TOption>["labelProps"];
  groupContainerProps?: MultiOptionFieldProps<TOption>["groupContainerProps"];
}

export default function StandardRadioGroup<TOption>(props: {
  field: StandardRadioGroupProps<TOption>;
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

  const options: Array<Option<TOption>> = useMemo(() => {
    let options = fieldConfig.options || [];
    if (fieldConfig.randomizeOptions) {
      options = shuffleArray(fieldConfig.options || []);
    }
    return options.map((opt) =>
      getOptionFromConfig(opt, fieldConfig.optionConfig)
    );
  }, [fieldConfig.options, fieldConfig.optionConfig]);

  const handleRadioChange = (value: TOption, checked: boolean) => {
    if (checked) {
      setValue(fieldConfig.attribute, value);
    }
  };

  const componentProps = (
    fieldConfig: StandardRadioGroupProps<TOption>,
    option: Option<TOption>,
    value: TOption
  ): RadioProps => {
    return {
      id: fieldConfig.attribute,
      key: option.key,
      color: "primary",
      ...fieldConfig.props,
      checked: isEqual(value, option.value),
      value: option.value,
      onChange: (event) =>
        handleRadioChange(option.value, event.target.checked),
    };
  };

  const containerProps = (
    fieldConfig: StandardRadioGroupProps<TOption>
  ): FormControlProps => {
    return {
      error: !!errors[fieldConfig.attribute],
      onBlur: () => trigger(fieldConfig.attribute),
      ...fieldConfig.groupContainerProps,
      sx: { flexWrap: "wrap", ...fieldConfig.groupContainerProps?.sx },
    };
  };

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      render={({ field }) => (
        <Fragment>
          {!hideTitle && fieldConfig.title && <Title field={fieldConfig} />}
          <FormGroup>
            <FormControl
              component={"fieldset" as "div"}
              {...containerProps(fieldConfig)}
            >
              {options.map((option, index) => (
                <FormControlLabel
                  key={fieldConfig.attribute + "-" + index}
                  control={
                    <Radio
                      {...componentProps(fieldConfig, option, field.value)}
                    />
                  }
                  label={option.label}
                  {...fieldConfig.labelProps}
                />
              ))}
            </FormControl>
            {!!errors[fieldConfig.attribute] && (
              <ErrorText error={errors[fieldConfig.attribute]?.message} />
            )}
          </FormGroup>
        </Fragment>
      )}
    />
  );
}
