import isEqual from "lodash/isEqual";
import React, { Fragment, useMemo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import {
  Checkbox, CheckboxProps, FormControl, FormControlLabel, FormControlProps, FormGroup
} from "@mui/material";

import { shuffleArray } from "../utils";
import { getOptionFromConfig, Option } from "../utils/options";
import { CommonFieldProps, MultiOptionFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title } from "./widgets/Title";

export interface StandardCheckboxGroupProps<TOption>
  extends CommonFieldProps<"checkbox-group", TOption> {
  attribute: Required<CommonFieldProps<"checkbox-group", TOption>>["attribute"];
  options: MultiOptionFieldProps<TOption>["options"];
  optionConfig?: MultiOptionFieldProps<TOption>["optionConfig"];
  randomizeOptions?: MultiOptionFieldProps<TOption>["randomizeOptions"];
  multiple?: MultiOptionFieldProps<TOption>["multiple"];
  labelProps?: MultiOptionFieldProps<TOption>["labelProps"];
  groupContainerProps?: MultiOptionFieldProps<TOption>["groupContainerProps"];
}

export default function StandardCheckboxGroup<TOption>(props: {
  field: StandardCheckboxGroupProps<TOption>;
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

  function handleCheckboxChange(
    option: Option<TOption>,
    checked: boolean,
    value: TOption | Array<TOption>
  ) {
    if (fieldConfig.multiple) {
      if (checked) {
        setValue(fieldConfig.attribute, [
          ...((value as Array<TOption>) || []),
          option.value,
        ]);
      } else {
        const index = ((value as Array<TOption>) || []).findIndex((value) =>
          isEqual(value, option.value)
        );
        if (index > -1) {
          let copy: Array<TOption> | undefined = [...(value as Array<TOption>)];
          copy.splice(index, 1);
          if (copy.length === 0) {
            copy = undefined;
          }
          setValue(fieldConfig.attribute, copy);
          return;
        }
      }
    } else {
      if (checked) {
        setValue(fieldConfig.attribute, option.value);
      } else {
        setValue(fieldConfig.attribute, undefined);
      }
    }
  }

  const componentProps = (
    fieldConfig: StandardCheckboxGroupProps<TOption>,
    option: Option<TOption>,
    value: TOption | Array<TOption>
  ): CheckboxProps => {
    let isSelected: boolean;
    if (fieldConfig.multiple && Array.isArray(value)) {
      isSelected =
        value && value.findIndex((v) => isEqual(v, option.value)) > -1;
    } else {
      isSelected = isEqual(value, option.value);
    }
    return {
      id: fieldConfig.id || fieldConfig.attribute,
      key: option.key,
      color: "primary",
      checked: isSelected,
      onChange: (event) =>
        handleCheckboxChange(option, event.target.checked, value),
      ...fieldConfig.props,
    };
  };

  const containerProps = (
    fieldConfig: StandardCheckboxGroupProps<TOption>
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
                    <Checkbox
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
