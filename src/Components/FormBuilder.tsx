import React, { useEffect } from "react";
import { Controller, Path, UseFormProps, UseFormReturn } from "react-hook-form";

import loadable from "@loadable/component";
import { Box, Grid, GridProps } from "@mui/material";

import {
  GridColMap, StandardCustomProps, StandardDisplayImageProps, StandardDisplayMediaProps,
  StandardDisplayTextProps
} from "./props/FieldProps";
import { StandardAutocompleteProps } from "./StandardAutocomplete";
import { StandardCheckboxGroupProps } from "./StandardCheckboxGroup";
import { StandardChipGroupProps } from "./StandardChipGroup";
import { StandardCounterProps } from "./StandardCounter";
import { StandardDatePickerProps } from "./StandardDatePicker";
import { StandardDateTimePickerProps } from "./StandardDateTimePicker";
import { StandardEditorProps } from "./StandardEditor";
import { StandardFileUploadProps } from "./StandardFileUpload";
import { StandardImagePickerProps } from "./StandardImagePicker";
import { StandardRadioGroupProps } from "./StandardRadioGroup";
import { StandardRatingProps } from "./StandardRating";
import { StandardSelectProps } from "./StandardSelect";
import { StandardSwitchProps } from "./StandardSwitch";
import { StandardTextFieldProps } from "./StandardTextField";
import { StandardTimePickerProps } from "./StandardTimePicker";
import { Title } from "./widgets/Title";

const StandardAutocomplete = loadable(() => import("./StandardAutocomplete"));
const StandardCheckboxGroup = loadable(() => import("./StandardCheckboxGroup"));
const StandardChipGroup = loadable(() => import("./StandardChipGroup"));
const StandardCounter = loadable(() => import("./StandardCounter"));
const StandardDatePicker = loadable(() => import("./StandardDatePicker"));
const StandardDateTimePicker = loadable(
  () => import("./StandardDateTimePicker")
);
const StandardEditor = loadable(() => import("./StandardEditor"));
const StandardFileUpload = loadable(() => import("./StandardFileUpload"));
const StandardImagePicker = loadable(() => import("./StandardImagePicker"));
const StandardRadioGroup = loadable(() => import("./StandardRadioGroup"));
const StandardRating = loadable(() => import("./StandardRating"));
const StandardSelect = loadable(() => import("./StandardSelect"));
const StandardSwitch = loadable(() => import("./StandardSwitch"));
const StandardTextField = loadable(() => import("./StandardTextField"));
const StandardTimePicker = loadable(() => import("./StandardTimePicker"));
const ReactPlayer = loadable(() => import("react-player"));

function sanitizeColProps(col?: GridColMap): GridColMap {
  col = col || {};
  return {
    xs: col.xs || 12,
    sm: col.sm,
    md: col.md,
    lg: col.lg,
    xl: col.xl,
  };
}

function handleField(field: FieldProp, index?: string | number): FieldProp {
  if (!field.id) {
    field.id = field.attribute;
    if (index) {
      field.id = index + "-" + field.id;
    }
    if (field.idPrefix) {
      field.id = field.idPrefix + "-" + field.id;
    }
  }
  return field;
}

export type FieldProp =
  | StandardAutocompleteProps<any>
  | StandardCheckboxGroupProps<any>
  | StandardChipGroupProps<any>
  | StandardCounterProps
  | StandardDatePickerProps
  | StandardDateTimePickerProps
  | StandardEditorProps
  | StandardFileUploadProps
  | StandardImagePickerProps
  | StandardRadioGroupProps<any>
  | StandardRatingProps
  | StandardSelectProps<any>
  | StandardSwitchProps
  | StandardTextFieldProps
  | StandardTimePickerProps
  | StandardDisplayTextProps
  | StandardDisplayImageProps
  | StandardDisplayMediaProps
  | StandardCustomProps;

function getFormComponent(field: FieldProp, methods: UseFormReturn<any>) {
  switch (field.component) {
    case "date-picker":
      return <StandardDatePicker field={field} methods={methods} />;
    case "date-time-picker":
      return <StandardDateTimePicker field={field} methods={methods} />;
    case "time-picker":
      return <StandardTimePicker field={field} methods={methods} />;
    case "select":
      return <StandardSelect field={field} methods={methods} />;
    case "autocomplete":
      return <StandardAutocomplete field={field} methods={methods} />;
    case "chip-group":
      return <StandardChipGroup field={field} methods={methods} />;
    case "checkbox-group":
      return <StandardCheckboxGroup field={field} methods={methods} />;
    case "radio-group":
      return <StandardRadioGroup field={field} methods={methods} />;
    case "switch":
      return <StandardSwitch field={field} methods={methods} />;
    case "file-upload":
      return <StandardFileUpload field={field} methods={methods} />;
    case "image-picker":
      return <StandardImagePicker field={field} methods={methods} />;
    case "rating":
      return <StandardRating field={field} methods={methods} />;
    case "counter":
      return <StandardCounter field={field} methods={methods} />;
    case "display-text":
      return <Title field={field} />;
    case "display-image":
      let f: StandardDisplayImageProps = field;
      return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src={f.src}
            alt={f.alt}
            title={f.alt}
            {...f.props}
            loading="lazy"
          />
        </Box>
      );
    case "display-media":
      return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ReactPlayer
            url={field.src}
            controls
            width={field.width}
            height={field.height}
            {...field.props}
          />
        </Box>
      );
    case "rich-text":
      return <StandardEditor field={field} methods={methods} />;
    case "custom":
      return (
        <Controller
          name={field.attribute || ""}
          control={methods.control}
          render={({ field: f }) =>
            field.customComponent!(field as any, methods, f)
          }
        />
      );
    case "text-field":
    default:
      return <StandardTextField field={field} methods={methods} />;
  }
}

interface Error<T> {
  attribute: Path<T>;
  type: string;
  message: string;
}

export interface FormBuilderProps<TForm> {
  fields: Array<FieldProp>;
  defaultValue: UseFormProps<TForm>["defaultValues"];
  children?: React.ReactNode;
  index?: string | number;
  idPrefix?: string;
  errors?: Array<Error<TForm>>;
  methods: UseFormReturn<any>;
  sx?: GridProps["sx"];
}

function FormBuilder<TForm>(props: FormBuilderProps<TForm>) {
  const { fields, defaultValue, children, errors, methods, sx } = props;

  useEffect(() => {
    methods.reset(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (errors) {
      for (const error of errors) {
        methods.setError(error.attribute, {
          type: error.type,
          message: error.message,
        });
      }
    }
  }, [errors]);

  return (
    <Box>
      <Grid container spacing={1} sx={sx}>
        {fields?.map((field, index) => {
          field = handleField(field, index);
          return (
            !field.hideCondition && (
              <Grid
                key={field.id || field.attribute || index}
                item
                {...sanitizeColProps(field.col)}
                {...field.containerProps}
              >
                {getFormComponent(field, methods)}
              </Grid>
            )
          );
        })}
      </Grid>
      {children}
    </Box>
  );
}

export { FormBuilder };
