import isEqual from "lodash/isEqual";
import isObject from "lodash/isObject";
import React, { Fragment, useState } from "react";
import { Controller, FieldValues, useFormContext, UseFormSetValue } from "react-hook-form";

import {
  Autocomplete, AutocompleteProps, AutocompleteRenderGetTagProps, Chip, TextField
} from "@mui/material";

import { getLabel, getOptionFromConfig, getOptions } from "../utils/autocomplete";
import { AutocompleteFieldProps, CommonFieldProps } from "./props/FieldProps";
import { Title } from "./widgets/Title";

export interface StandardAutocompleteProps<T>
  extends CommonFieldProps<"autocomplete">,
    AutocompleteFieldProps<T> {
  attribute: Required<CommonFieldProps<"autocomplete">>["attribute"];
}

function reorderTags<T>(
  list: Array<T>,
  startIndex: number,
  endIndex: number
): Array<T> {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

async function renderDnd<T>(
  value: Array<T>,
  setValue: UseFormSetValue<FieldValues>,
  options: Array<T>,
  fieldConfig: StandardAutocompleteProps<T>,
  getTagProps: AutocompleteRenderGetTagProps
): Promise<React.ReactNode> {
  const dnd = await import("react-beautiful-dnd");
  const { DragDropContext, Draggable, Droppable } = dnd;

  const onDragEnd =
    (
      value: Array<T>,
      setValue: UseFormSetValue<FieldValues>,
      fieldConfig: StandardAutocompleteProps<T>
    ) =>
    (result: import("react-beautiful-dnd").DropResult) => {
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      const reordered: Array<T> = reorderTags(
        value || [],
        result.source.index,
        result.destination.index
      );

      setValue(fieldConfig.attribute, reordered);
    };

  return (
    <DragDropContext onDragEnd={onDragEnd(value, setValue, fieldConfig)}>
      <Droppable droppableId="options">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {value.map((option, index) => (
              <Draggable
                key={index}
                draggableId={String(index)}
                index={index}
                isDragDisabled={!fieldConfig.props?.multiple}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Chip
                      variant="outlined"
                      label={getLabel(
                        option,
                        options,
                        fieldConfig.optionConfig
                      )}
                      style={{ cursor: "grab" }}
                      {...getTagProps({ index })}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

function StandardAutocomplete<T>(props: {
  field: StandardAutocompleteProps<T>;
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
  const [focused, setFocused] = useState<boolean>();

  const options = getOptions<T>(
    fieldConfig.options,
    fieldConfig.randomizeOptions
  );

  function multipleComponentProps(
    fieldConfig: StandardAutocompleteProps<T>,
    value?: Array<T>
  ): AutocompleteProps<T, true, true, true> {
    return {
      id: fieldConfig.attribute,
      size: "small",
      fullWidth: true,
      isOptionEqualToValue: (option, value) => {
        // Required to handle the quirky behaviour of Autocomplete component
        // where it returns the value object sometimes and value value sometimes
        return isObject(value)
          ? isEqual(
              getOptionFromConfig(
                option,
                fieldConfig.optionConfig,
                fieldConfig.props?.multiple
              ),
              getOptionFromConfig(
                value,
                fieldConfig.optionConfig,
                fieldConfig.props?.multiple
              )
            )
          : getOptionFromConfig(
              option,
              fieldConfig.optionConfig,
              fieldConfig.props?.multiple
            ) === value;
      },
      getOptionLabel: (option) =>
        getLabel<T>(option, options, fieldConfig.optionConfig),
      renderTags: (value, getTagProps) => {
        // if (fieldConfig.sortable && focused) {
        //   return renderDnd(
        //     value,
        //     setValue,
        //     options,
        //     fieldConfig,
        //     getTagProps
        //   ).then((component) => component);
        // } else {
        return value.map((option, index) => (
          <Chip
            variant="outlined"
            size="small"
            label={getLabel<T>(option, options, fieldConfig.optionConfig)}
            {...getTagProps({ index })}
            key={index}
          />
        ));
        // }
      },
      value: value || [],
      onChange: (event, option) => {
        setValue(
          fieldConfig.attribute,
          getOptionFromConfig(
            option,
            fieldConfig.optionConfig,
            fieldConfig.props?.multiple
          )
        );
      },
      onBlur: () => {
        setFocused(false);
        trigger(fieldConfig.attribute);
      },
      onFocus: () => setFocused(true),
      ...(fieldConfig.props as AutocompleteProps<T, true, true, true>),
      options,
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
    };
  }

  function singleComponentProps(
    fieldConfig: StandardAutocompleteProps<T>,
    value?: NonNullable<T>
  ): AutocompleteProps<T, false, true, true> {
    return {
      id: fieldConfig.attribute,
      size: "small",
      fullWidth: true,
      isOptionEqualToValue: (option, value) => {
        // Required to handle the quirky behaviour of Autocomplete component
        // where it returns the value object sometimes and value value sometimes
        return isObject(value)
          ? isEqual(
              getOptionFromConfig(
                option,
                fieldConfig.optionConfig,
                fieldConfig.props?.multiple
              ),
              getOptionFromConfig(
                value,
                fieldConfig.optionConfig,
                fieldConfig.props?.multiple
              )
            )
          : getOptionFromConfig(
              option,
              fieldConfig.optionConfig,
              fieldConfig.props?.multiple
            ) === value;
      },
      getOptionLabel: (option) =>
        getLabel(option, options, fieldConfig.optionConfig),
      value: value,
      onChange: (event, option) => {
        setValue(
          fieldConfig.attribute,
          getOptionFromConfig(
            option,
            fieldConfig.optionConfig,
            fieldConfig.props?.multiple
          )
        );
      },
      onBlur: () => {
        setFocused(false);
        trigger(fieldConfig.attribute);
      },
      onFocus: () => setFocused(true),
      ...(fieldConfig.props as AutocompleteProps<T, false, true, true>),
      options,
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
    };
  }

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      render={({ field }) => (
        <Fragment>
          {!hideTitle && fieldConfig.title && <Title field={fieldConfig} />}
          {fieldConfig.props?.multiple ? (
            <Autocomplete
              {...multipleComponentProps(fieldConfig, field.value)}
            />
          ) : (
            <Autocomplete {...singleComponentProps(fieldConfig, field.value)} />
          )}
        </Fragment>
      )}
    />
  );
}

export { StandardAutocomplete };
