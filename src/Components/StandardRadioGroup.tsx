import React, { forwardRef, Fragment, useMemo } from "react";
import { Controller, ControllerRenderProps, useFormContext } from "react-hook-form";

import {
  FormControl, FormControlLabel, FormControlProps, FormGroup, Radio, RadioProps, Typography
} from "@mui/material";

import { getTitleProps, shuffleArray } from "../utils";
import { getOptionFromConfig, Option } from "../utils/options";
import { CommonFieldProps, MultiOptionFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title, TitleProps } from "./widgets/Title";

export interface StandardRadioGroupProps
  extends CommonFieldProps,
    MultiOptionFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  props: RadioProps;
}

const StandardRadioGroup = forwardRef(
  (props: { field: StandardRadioGroupProps; showTitle: boolean }, ref) => {
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

    const handleRadioChange = (value: unknown, checked: boolean) => {
      if (checked) {
        setValue(fieldConfig.attribute, value);
      }
    };

    const componentProps = (
      fieldConfig: StandardRadioGroupProps,
      option: Option,
      value: unknown
    ): RadioProps => {
      return {
        id: fieldConfig.attribute,
        key: option.key,
        color: "primary",
        ...fieldConfig.props,
        checked: value === option.value,
        value: option.value,
        onChange: (event) =>
          handleRadioChange(event.target.value, event.target.checked),
      };
    };

    const containerProps = (
      fieldConfig: StandardRadioGroupProps
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
            {showTitle && titleProps.title && <Title {...titleProps} />}
            <FormGroup ref={ref}>
              <FormControl {...containerProps(fieldConfig)}>
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
                <ErrorText error={errors[fieldConfig.attribute].message} />
              )}
            </FormGroup>
          </Fragment>
        )}
      />
    );
  }
);

export { StandardRadioGroup };
