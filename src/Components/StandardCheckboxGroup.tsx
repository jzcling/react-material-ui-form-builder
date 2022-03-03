import React, { Fragment, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import {
  Checkbox, CheckboxProps, FormControl, FormControlLabel, FormControlProps, FormGroup
} from "@mui/material";

import { getTitleProps, shuffleArray } from "../utils";
import { getOptionFromConfig, Option } from "../utils/options";
import { CommonFieldProps, MultiOptionFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title, TitleProps } from "./widgets/Title";

export interface StandardCheckboxGroupProps extends CommonFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  props?: CheckboxProps;
  options: MultiOptionFieldProps["options"];
  optionConfig: MultiOptionFieldProps["optionConfig"];
  randomizeOptions: MultiOptionFieldProps["randomizeOptions"];
  multiple: MultiOptionFieldProps["multiple"];
  labelProps: MultiOptionFieldProps["labelProps"];
  groupContainerProps: MultiOptionFieldProps["groupContainerProps"];
}

const StandardCheckboxGroup = (props: {
  field: StandardCheckboxGroupProps;
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

  const options: Array<Option> = useMemo(() => {
    let options = fieldConfig.options || [];
    if (fieldConfig.randomizeOptions) {
      options = shuffleArray(fieldConfig.options || []);
    }
    return options.map((opt) =>
      getOptionFromConfig(opt, fieldConfig.optionConfig)
    );
  }, [fieldConfig.options, fieldConfig.optionConfig]);

  const handleCheckboxChange = (
    option: Option,
    checked: boolean,
    value: unknown | Array<unknown>
  ) => {
    if (fieldConfig.multiple && Array.isArray(value)) {
      if (checked) {
        setValue(fieldConfig.attribute, [...(value || []), option.value]);
      } else {
        const index = (value || []).findIndex(
          (value) => value === option.value
        );
        if (index >= 0) {
          let copy: Array<unknown> | undefined = [...value];
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
  };

  const componentProps = (
    fieldConfig: StandardCheckboxGroupProps,
    option: Option,
    value: unknown | Array<unknown>
  ): CheckboxProps => {
    let isSelected: boolean;
    if (fieldConfig.multiple && Array.isArray(value)) {
      isSelected = value && value.includes(option.value);
    } else {
      isSelected = value === option.value;
    }
    return {
      id: fieldConfig.attribute,
      key: option.key,
      color: "primary",
      checked: isSelected,
      onChange: (event) =>
        handleCheckboxChange(option, event.target.checked, value),
      ...fieldConfig.props,
    };
  };

  const containerProps = (
    fieldConfig: StandardCheckboxGroupProps
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
      defaultValue={getValues(fieldConfig.attribute) || 0}
      render={({ field }) => (
        <Fragment>
          {showTitle && fieldConfig.title && <Title field={fieldConfig} />}
          <FormGroup>
            <FormControl {...containerProps(fieldConfig)}>
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
            {errors?.length > 0 && <ErrorText error={errors[0]} />}
          </FormGroup>
        </Fragment>
      )}
    />
  );
};

export { StandardCheckboxGroup };
