import isObject from "lodash/isObject";
import React, { forwardRef, Fragment } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Autocomplete, AutocompleteProps, Chip, TextField } from "@mui/material";

import { getTitleProps } from "../utils";
import {
  AutocompleteOption, getLabel, getOptionFromConfig, getOptions
} from "../utils/autocomplete";
import { AutocompleteFieldProps, CommonFieldProps } from "./props/FieldProps";
import { Title, TitleProps } from "./widgets/Title";

export interface StandardAutocompleteProps
  extends CommonFieldProps,
    AutocompleteFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  props:
    | AutocompleteProps<unknown, true, true, true>
    | AutocompleteProps<unknown, false, true, true>;
}

const StandardAutocomplete = forwardRef(
  (props: { field: StandardAutocompleteProps; showTitle: boolean }, ref) => {
    const {
      control,
      getValues,
      setValue,
      trigger,
      formState: { errors },
    } = useFormContext();
    const { field: fieldConfig, showTitle } = props;
    const titleProps: TitleProps = getTitleProps(fieldConfig);

    const options = getOptions(
      fieldConfig.options,
      fieldConfig.randomizeOptions
    );

    const multipleComponentProps = (
      fieldConfig: StandardAutocompleteProps,
      value?: Array<unknown>
    ): AutocompleteProps<unknown, true, true, true> => {
      return {
        id: fieldConfig.attribute,
        size: "small",
        fullWidth: true,
        autoHighlight: true,
        autoSelect: true,
        onChange: (event, value) => setValue(fieldConfig.attribute, value),
        onBlur: () => trigger(fieldConfig.attribute),
        isOptionEqualToValue: (option, value) => {
          /**
           * Required to handle the quirky behaviour of Autocomplete component
           * where it returns the value object sometimes and value value sometimes
           */
          return isObject(value)
            ? getOptionFromConfig(option).value ===
                getOptionFromConfig(value).value
            : getOptionFromConfig(option).value === value;
        },
        getOptionLabel: (option) =>
          getLabel(
            option as AutocompleteOption,
            fieldConfig.options,
            fieldConfig.optionConfig
          ),
        renderTags: (value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              size="small"
              label={getLabel(
                option as AutocompleteOption,
                fieldConfig.options,
                fieldConfig.optionConfig
              )}
              {...getTagProps({ index })}
              key={index}
            />
          )),
        ...(fieldConfig.props as AutocompleteProps<unknown, true, true, true>),
        options: options,
        renderInput: (params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            inputProps={{
              ...params.inputProps,
              autoComplete: "off", // disable autocomplete and autofill
            }}
            label={fieldConfig.label}
            error={!!errors[fieldConfig.attribute]}
            helperText={errors[fieldConfig.attribute]?.message}
          />
        ),
        value: value || [],
      };
    };

    const singleComponentProps = (
      fieldConfig: StandardAutocompleteProps,
      value?: unknown
    ): AutocompleteProps<unknown, false, true, true> => {
      return {
        id: fieldConfig.attribute,
        size: "small",
        fullWidth: true,
        autoHighlight: true,
        autoSelect: true,
        onChange: (event, value) => setValue(fieldConfig.attribute, value),
        onBlur: () => trigger(fieldConfig.attribute),
        isOptionEqualToValue: (option, value) => {
          /**
           * Required to handle the quirky behaviour of Autocomplete component
           * where it returns the value object sometimes and value value sometimes
           */
          return isObject(value)
            ? getOptionFromConfig(option).value ===
                getOptionFromConfig(value).value
            : getOptionFromConfig(option).value === value;
        },
        getOptionLabel: (option) =>
          getLabel(
            option as AutocompleteOption,
            fieldConfig.options,
            fieldConfig.optionConfig
          ),
        renderTags: (value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              size="small"
              label={getLabel(
                option as AutocompleteOption,
                fieldConfig.options,
                fieldConfig.optionConfig
              )}
              {...getTagProps({ index })}
              key={index}
            />
          )),
        ...(fieldConfig.props as AutocompleteProps<unknown, false, true, true>),
        options: options,
        renderInput: (params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            inputProps={{
              ...params.inputProps,
              autoComplete: "off", // disable autocomplete and autofill
            }}
            label={fieldConfig.label}
            error={!!errors[fieldConfig.attribute]}
            helperText={errors[fieldConfig.attribute]?.message}
          />
        ),
        value: value || null,
      };
    };

    return (
      <Controller
        name={fieldConfig.attribute}
        control={control}
        render={({ field }) => (
          <Fragment>
            {showTitle && titleProps.title && <Title {...titleProps} />}
            {fieldConfig.props?.multiple ? (
              <Autocomplete
                ref={ref}
                {...multipleComponentProps(fieldConfig, field.value)}
              />
            ) : (
              <Autocomplete
                ref={ref}
                {...singleComponentProps(fieldConfig, field.value)}
              />
            )}
          </Fragment>
        )}
      />
    );
  }
);

export { StandardAutocomplete };
