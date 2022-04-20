import isEqual from "lodash/isEqual";
import React, { Fragment, useMemo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import { Box, Chip, ChipProps, FormControl, FormControlProps, FormGroup } from "@mui/material";

import { shuffleArray } from "../utils";
import { getOptionFromConfig, Option } from "../utils/options";
import { ChipGroupFieldProps, CommonFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title } from "./widgets/Title";

export interface StandardChipGroupProps<TOption>
  extends CommonFieldProps<"chip-group", TOption>,
    ChipGroupFieldProps<TOption> {
  attribute: Required<CommonFieldProps<"chip-group", TOption>>["attribute"];
}

export default function StandardChipGroup<TOption>(props: {
  field: StandardChipGroupProps<TOption>;
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

  function handleChipClick(
    option: Option<TOption>,
    value: TOption | Array<TOption>
  ): void {
    if (fieldConfig.multiple) {
      const index = ((value as Array<TOption>) || []).findIndex(
        (opt: TOption) => isEqual(opt, option.value)
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
      setValue(fieldConfig.attribute, [
        ...((value as Array<TOption>) || []),
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
    fieldConfig: StandardChipGroupProps<TOption>,
    option: Option<TOption>,
    value: TOption | Array<TOption>
  ): ChipProps => {
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
    fieldConfig: StandardChipGroupProps<TOption>
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
                <Box key={fieldConfig.attribute + "-" + index}>
                  <Chip {...componentProps(fieldConfig, option, field.value)} />
                </Box>
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
