import React, { Fragment, MouseEventHandler, useMemo } from "react";
import { Controller, ControllerRenderProps, useFormContext } from "react-hook-form";

import {
  Box, Chip, ChipProps, FormControl, FormControlProps, FormGroup, SxProps, TypographyProps
} from "@mui/material";

import { getTitleProps, shuffleArray } from "../utils";
import { getOptionFromConfig, Option } from "../utils/options";
import { ChipGroupFieldProps, CommonFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title, TitleProps } from "./widgets/Title";

export interface StandardChipGroupProps
  extends CommonFieldProps,
    ChipGroupFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  props?: ChipProps & {
    onClick?: (
      option: Option,
      value: unknown | Array<unknown>
    ) => MouseEventHandler;
  };
}

const StandardChipGroup = (props: {
  field: StandardChipGroupProps;
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

  const handleChipClick = (
    option: Option,
    value: unknown | Array<unknown>
  ): void => {
    if (fieldConfig.multiple && Array.isArray(value)) {
      const index = (value || []).findIndex(
        (opt: unknown) => opt === option.value
      );
      if (index >= 0) {
        let copy: Array<Option> | undefined = [...value];
        copy.splice(index, 1);
        if (copy.length === 0) {
          copy = undefined;
        }
        setValue(fieldConfig.attribute, copy);
        return;
      }
      setValue(fieldConfig.attribute, [...(value || []), option.value]);
    } else {
      if (value === option.value) {
        setValue(fieldConfig.attribute, undefined);
        return;
      }
      setValue(fieldConfig.attribute, option.value);
    }
  };

  const componentProps = (
    fieldConfig: StandardChipGroupProps,
    option: Option,
    value: unknown | Array<unknown>
  ): ChipProps => {
    let isSelected: boolean;
    if (fieldConfig.multiple && Array.isArray(value)) {
      isSelected = value && value.includes(option.value);
    } else {
      isSelected = value === option.value;
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
    fieldConfig: StandardChipGroupProps
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
};

export { StandardChipGroup };
