import { isEqual } from "lodash";
import React, { Fragment, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import {
  Checkbox, CheckboxProps, FormControl, FormControlLabel, FormControlProps, FormGroup
} from "@mui/material";

import { shuffleArray } from "../utils";
import { getOptionFromConfig, Option } from "../utils/options";
import { CommonFieldProps, MultiOptionFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title } from "./widgets/Title";

export interface StandardCheckboxGroupProps<T>
  extends CommonFieldProps<"checkbox-group"> {
  attribute: Required<CommonFieldProps<"checkbox-group">>["attribute"];
  options: MultiOptionFieldProps<T>["options"];
  optionConfig?: MultiOptionFieldProps<T>["optionConfig"];
  randomizeOptions?: MultiOptionFieldProps<T>["randomizeOptions"];
  multiple?: MultiOptionFieldProps<T>["multiple"];
  labelProps?: MultiOptionFieldProps<T>["labelProps"];
  groupContainerProps?: MultiOptionFieldProps<T>["groupContainerProps"];
}

function StandardCheckboxGroup<T>(props: {
  field: StandardCheckboxGroupProps<T>;
  hideTitle?: boolean;
}) {
  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();
  const { field: fieldConfig, hideTitle } = props;

  const options: Array<Option<T>> = useMemo(() => {
    let options = fieldConfig.options || [];
    if (fieldConfig.randomizeOptions) {
      options = shuffleArray(fieldConfig.options || []);
    }
    return options.map((opt) =>
      getOptionFromConfig(opt, fieldConfig.optionConfig)
    );
  }, [fieldConfig.options, fieldConfig.optionConfig]);

  function handleCheckboxChange(
    option: Option<T>,
    checked: boolean,
    value: T | Array<T>
  ) {
    if (fieldConfig.multiple) {
      if (checked) {
        setValue(fieldConfig.attribute, [
          ...((value as Array<T>) || []),
          option.value,
        ]);
      } else {
        const index = ((value as Array<T>) || []).findIndex((value) =>
          isEqual(value, option.value)
        );
        if (index > -1) {
          let copy: Array<T> | undefined = [...(value as Array<T>)];
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
    fieldConfig: StandardCheckboxGroupProps<T>,
    option: Option<T>,
    value: T | Array<T>
  ): CheckboxProps => {
    let isSelected: boolean;
    if (fieldConfig.multiple && Array.isArray(value)) {
      isSelected =
        value && value.findIndex((v) => isEqual(v, option.value)) > -1;
    } else {
      isSelected = isEqual(value, option.value);
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
    fieldConfig: StandardCheckboxGroupProps<T>
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

export { StandardCheckboxGroup };
