import { isEqual } from "lodash";
import React, { Fragment, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Box, Chip, ChipProps, FormControl, FormControlProps, FormGroup } from "@mui/material";

import { shuffleArray } from "../utils";
import { getOptionFromConfig, Option } from "../utils/options";
import { ChipGroupFieldProps, CommonFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title } from "./widgets/Title";

export interface StandardChipGroupProps<T>
  extends CommonFieldProps<"chip-group">,
    ChipGroupFieldProps<T> {
  attribute: Required<CommonFieldProps<"chip-group">>["attribute"];
}

function StandardChipGroup<T>(props: {
  field: StandardChipGroupProps<T>;
  showTitle?: boolean;
}) {
  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();
  const { field: fieldConfig, showTitle } = props;

  const options: Array<Option<T>> = useMemo(() => {
    let options = fieldConfig.options || [];
    if (fieldConfig.randomizeOptions) {
      options = shuffleArray(fieldConfig.options || []);
    }
    return options.map((opt) =>
      getOptionFromConfig(opt, fieldConfig.optionConfig)
    );
  }, [fieldConfig.options, fieldConfig.optionConfig]);

  function handleChipClick(option: Option<T>, value: T | Array<T>): void {
    if (fieldConfig.multiple) {
      const index = ((value as Array<T>) || []).findIndex((opt: T) =>
        isEqual(opt, option.value)
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
      setValue(fieldConfig.attribute, [
        ...((value as Array<T>) || []),
        option.value,
      ]);
    } else {
      if (isEqual(value, option.value)) {
        setValue(fieldConfig.attribute, undefined);
        return;
      }
      setValue(fieldConfig.attribute, option.value);
    }
  }

  const componentProps = (
    fieldConfig: StandardChipGroupProps<T>,
    option: Option<T>,
    value: T | Array<T>
  ): ChipProps => {
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
      label: option.label,
      color: isSelected ? "primary" : "default",
      variant: isSelected ? "filled" : "outlined",
      ...fieldConfig.props,
      sx: {
        height: "auto",
        margin: "4px 8px 4px 0",
        borderRadius: "20px",
        ...fieldConfig.props?.sx,
        "& .MuiChip-label": {
          padding: "8px",
          ...fieldConfig.labelProps?.style,
        },
      },
      onClick: fieldConfig.props?.onClick
        ? fieldConfig.props.onClick(option, value)
        : () => handleChipClick(option, value),
    };
  };

  const containerProps = (
    fieldConfig: StandardChipGroupProps<T>
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
            <FormControl
              component={"fieldset" as "div"}
              {...containerProps(fieldConfig)}
            >
              {options.map((option, index) => (
                <Box key={fieldConfig.attribute + "-" + index}>
                  <Chip {...componentProps(fieldConfig, option, field.value)} />
                </Box>
              ))}
            </FormControl>
            {!!errors[fieldConfig.attribute] && (
              <ErrorText error={errors[fieldConfig.attribute].message} />
            )}
          </FormGroup>
        </Fragment>
      )}
    />
  );
}

export { StandardChipGroup };
