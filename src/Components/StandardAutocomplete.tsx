import isObject from "lodash/isObject";
import React, { Fragment, useState } from "react";
import { Controller, FieldValues, useFormContext, UseFormSetValue } from "react-hook-form";

import {
  Autocomplete, AutocompleteProps, AutocompleteRenderGetTagProps, Chip, TextField
} from "@mui/material";

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
  props?:
    | AutocompleteProps<unknown, true, true, true>
    | AutocompleteProps<unknown, false, true, true>;
}

const reorderTags = (
  list: Array<unknown>,
  startIndex: number,
  endIndex: number
): Array<unknown> => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

async function renderDnd(
  value: Array<unknown>,
  setValue: UseFormSetValue<FieldValues>,
  fieldConfig: StandardAutocompleteProps,
  getTagProps: AutocompleteRenderGetTagProps
) {
  const dnd = await import("react-beautiful-dnd");
  const { DragDropContext, Draggable, Droppable } = dnd;

  const onDragEnd =
    (
      value: Array<unknown>,
      setValue: UseFormSetValue<FieldValues>,
      fieldConfig: StandardAutocompleteProps
    ) =>
    (result: import("react-beautiful-dnd").DropResult) => {
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      const reordered = reorderTags(
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
                        option as AutocompleteOption,
                        fieldConfig.options,
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

const StandardAutocomplete = (props: {
  field: StandardAutocompleteProps;
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
  const [focused, setFocused] = useState<boolean>();

  const options = getOptions(fieldConfig.options, fieldConfig.randomizeOptions);

  const multipleComponentProps = (
    fieldConfig: StandardAutocompleteProps,
    value?: Array<unknown>
  ): AutocompleteProps<unknown, true, true, true> => {
    return {
      id: fieldConfig.attribute,
      size: "small",
      fullWidth: true,
      isOptionEqualToValue: (option, value) => {
        // Required to handle the quirky behaviour of Autocomplete component
        // where it returns the value object sometimes and value value sometimes
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
      renderTags: async (value, getTagProps) => {
        if (fieldConfig.sortable && focused) {
          return await renderDnd(value, setValue, fieldConfig, getTagProps);
        } else {
          return value.map((option, index) => (
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
          ));
        }
      },
      value: value || [],
      onChange: (event, option) => {
        setValue(fieldConfig.attribute, getOptionFromConfig(option).value);
      },
      onBlur: () => {
        setFocused(false);
        trigger(fieldConfig.attribute);
      },
      onFocus: () => setFocused(true),
      ...(fieldConfig.props as AutocompleteProps<unknown, true, true, true>),
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
  };

  const singleComponentProps = (
    fieldConfig: StandardAutocompleteProps,
    value?: unknown
  ): AutocompleteProps<unknown, false, true, true> => {
    return {
      id: fieldConfig.attribute,
      size: "small",
      fullWidth: true,
      isOptionEqualToValue: (option, value) => {
        // Required to handle the quirky behaviour of Autocomplete component
        // where it returns the value object sometimes and value value sometimes
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
      renderTags: async (value, getTagProps) => {
        if (fieldConfig.sortable && focused) {
          return await renderDnd(value, setValue, fieldConfig, getTagProps);
        } else {
          return value.map((option, index) => (
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
          ));
        }
      },
      value: value || null,
      onChange: (event, option) => {
        setValue(fieldConfig.attribute, getOptionFromConfig(option).value);
      },
      onBlur: () => {
        setFocused(false);
        trigger(fieldConfig.attribute);
      },
      onFocus: () => setFocused(true),
      ...(fieldConfig.props as AutocompleteProps<unknown, false, true, true>),
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
  };

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      render={({ field }) => (
        <Fragment>
          {showTitle && fieldConfig.title && <Title field={fieldConfig} />}
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
};

export { StandardAutocomplete };
