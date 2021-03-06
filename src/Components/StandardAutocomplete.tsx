import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isObject from "lodash/isObject";
import React, { Fragment, useState } from "react";
import { Controller, FieldValues, UseFormReturn, UseFormSetValue } from "react-hook-form";

import {
  Autocomplete, AutocompleteProps, AutocompleteRenderGetTagProps, AutocompleteRenderInputParams,
  Chip, TextField
} from "@mui/material";

import { getLabel, getOptionFromConfig, getOptions } from "../utils/autocomplete";
import { AutocompleteFieldProps, CommonFieldProps } from "./props/FieldProps";
import { Title } from "./widgets/Title";

export interface StandardAutocompleteProps<TOption>
  extends CommonFieldProps<"autocomplete", TOption>,
    AutocompleteFieldProps<TOption> {
  attribute: Required<CommonFieldProps<"autocomplete", TOption>>["attribute"];
}

function reorderTags<TOption>(
  list: Array<TOption>,
  startIndex: number,
  endIndex: number
): Array<TOption> {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

async function renderDnd<TOption>(
  value: Array<TOption>,
  setValue: UseFormSetValue<FieldValues>,
  options: Array<TOption>,
  fieldConfig: StandardAutocompleteProps<TOption>,
  getTagProps: AutocompleteRenderGetTagProps
): Promise<React.ReactNode> {
  const dnd = await import("react-beautiful-dnd");
  const { DragDropContext, Draggable, Droppable } = dnd;

  const onDragEnd =
    (
      value: Array<TOption>,
      setValue: UseFormSetValue<FieldValues>,
      fieldConfig: StandardAutocompleteProps<TOption>
    ) =>
    (result: import("react-beautiful-dnd").DropResult) => {
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      const reordered: Array<TOption> = reorderTags(
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

export default function StandardAutocomplete<TOption>(props: {
  field: StandardAutocompleteProps<TOption>;
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
  const [focused, setFocused] = useState<boolean>();

  const options = getOptions<TOption>(
    fieldConfig.options,
    fieldConfig.randomizeOptions
  );

  function componentProps(
    fieldConfig: StandardAutocompleteProps<TOption>,
    value?: Array<TOption>
  ): AutocompleteProps<TOption, boolean, boolean, boolean> {
    const multiple = fieldConfig.props?.multiple || false;
    const disableClearable = fieldConfig.props?.disableClearable || false;
    const freeSolo = fieldConfig.props?.freeSolo || false;

    let props: AutocompleteProps<
      TOption,
      typeof multiple,
      typeof disableClearable,
      typeof freeSolo
    > = {
      id: fieldConfig.id || fieldConfig.attribute,
      size: "small",
      fullWidth: true,
      isOptionEqualToValue: (option: TOption, value: TOption) => {
        // Required to handle the quirky behaviour of Autocomplete component
        // where it returns the value object sometimes and value value sometimes
        return isObject(value)
          ? isEqual(
              getOptionFromConfig(option, fieldConfig.optionConfig, multiple),
              getOptionFromConfig(value, fieldConfig.optionConfig, multiple)
            )
          : getOptionFromConfig(option, fieldConfig.optionConfig, multiple) ===
              value;
      },
      getOptionLabel: (option: string | TOption) =>
        getLabel(option, options, fieldConfig.optionConfig),
      onChange: (
        event: React.SyntheticEvent<Element, Event>,
        option:
          | string
          | TOption
          | NonNullable<TOption>
          | (string | TOption)[]
          | null
      ) => {
        setValue(
          fieldConfig.attribute,
          getOptionFromConfig(option, fieldConfig.optionConfig, multiple)
        );
      },
      onBlur: () => {
        setFocused(false);
        trigger(fieldConfig.attribute);
      },
      onFocus: () => setFocused(true),
      value: value || (multiple ? [] : ""),
      ...(fieldConfig.props as AutocompleteProps<
        TOption,
        typeof multiple,
        typeof disableClearable,
        typeof freeSolo
      >),
      options,
      renderInput: (params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          inputProps={{
            ...params.inputProps,
            autoComplete: "off", // disable autocomplete and autofill
          }}
          label={fieldConfig.label}
          error={!!get(errors, fieldConfig.attribute)}
          helperText={get(errors, fieldConfig.attribute)?.message}
        />
      ),
    };

    if (multiple) {
      props = {
        ...props,
        renderTags: (
          value: Array<TOption>,
          getTagProps: AutocompleteRenderGetTagProps
        ) => {
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
              label={getLabel(option, options, fieldConfig.optionConfig)}
              {...getTagProps({ index })}
              key={index}
            />
          ));
          // }
        },
      };
    }

    return props;
  }

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      render={({ field }) => (
        <Fragment>
          {!hideTitle && fieldConfig.title && <Title field={fieldConfig} />}
          <Autocomplete {...componentProps(fieldConfig, field.value)} />
        </Fragment>
      )}
    />
  );
}
