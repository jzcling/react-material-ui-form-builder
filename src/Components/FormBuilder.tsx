import { useEffect } from "react";
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, Typography } from "@mui/material";

import { useValidation } from "../hooks/useValidation";
import { Unpack } from "../utils";
import {
  GridColMap, StandardCustomProps, StandardDisplayImageProps, StandardDisplayMediaProps,
  StandardDisplayTextProps
} from "./props/FieldProps";
import { StandardAutocomplete, StandardAutocompleteProps } from "./StandardAutocomplete";
import { StandardCheckboxGroup, StandardCheckboxGroupProps } from "./StandardCheckboxGroup";
import { StandardChipGroup, StandardChipGroupProps } from "./StandardChipGroup";
import { StandardCounter, StandardCounterProps } from "./StandardCounter";
import { StandardDatePicker, StandardDatePickerProps } from "./StandardDatePicker";
import { StandardDateTimePicker, StandardDateTimePickerProps } from "./StandardDateTimePicker";
import { StandardEditor, StandardEditorProps } from "./StandardEditor";
import { StandardFileUpload, StandardFileUploadProps } from "./StandardFileUpload";
import { StandardImagePicker, StandardImagePickerProps } from "./StandardImagePicker";
import { StandardRadioGroup, StandardRadioGroupProps } from "./StandardRadioGroup";
import { StandardRating, StandardRatingProps } from "./StandardRating";
import { StandardSelect, StandardSelectProps } from "./StandardSelect";
import { StandardSwitch, StandardSwitchProps } from "./StandardSwitch";
import { StandardTextField, StandardTextFieldProps } from "./StandardTextField";
import { StandardTimePicker, StandardTimePickerProps } from "./StandardTimePicker";
import { Title } from "./widgets/Title";

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

async function renderReactPlayer(field: StandardDisplayMediaProps) {
  const module = await import("react-player");
  const ReactPlayer = module.default;
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
}

const handleField = (
  field: FieldProp,
  index?: string | number,
  idPrefix?: string
): FieldProp => {
  if (!field.id) {
    field.id = field.attribute;
    if (index) {
      field.id = index + "-" + field.id;
    }
    if (idPrefix) {
      field.id = idPrefix + "-" + field.id;
    }
  }
  return field;
};

export type FieldProp =
  | StandardAutocompleteProps<unknown>
  | StandardCheckboxGroupProps<unknown>
  | StandardChipGroupProps<unknown>
  | StandardCounterProps
  | StandardDatePickerProps
  | StandardDateTimePickerProps
  | StandardEditorProps
  | StandardFileUploadProps
  | StandardImagePickerProps
  | StandardRadioGroupProps<unknown>
  | StandardRatingProps
  | StandardSelectProps
  | StandardSwitchProps
  | StandardTextFieldProps
  | StandardTimePickerProps
  | StandardDisplayTextProps
  | StandardDisplayImageProps
  | StandardDisplayMediaProps
  | StandardCustomProps;

function getFormComponent(field: FieldProp) {
  switch (field.component) {
    case "date-picker":
      return <StandardDatePicker field={field as StandardDatePickerProps} />;
    case "date-time-picker":
      return (
        <StandardDateTimePicker field={field as StandardDateTimePickerProps} />
      );
    case "time-picker":
      return <StandardTimePicker field={field as StandardTimePickerProps} />;
    case "select":
      return <StandardSelect field={field as StandardSelectProps} />;
    case "autocomplete":
      return (
        <StandardAutocomplete<Unpack<typeof field.options>>
          field={
            field as StandardAutocompleteProps<Unpack<typeof field.options>>
          }
        />
      );
    case "chip-group":
      return (
        <StandardChipGroup<Unpack<typeof field.options>>
          field={field as StandardChipGroupProps<Unpack<typeof field.options>>}
        />
      );
    case "checkbox-group":
      return (
        <StandardCheckboxGroup<Unpack<typeof field.options>>
          field={
            field as StandardCheckboxGroupProps<Unpack<typeof field.options>>
          }
        />
      );
    case "radio-group":
      return (
        <StandardRadioGroup<Unpack<typeof field.options>>
          field={field as StandardRadioGroupProps<Unpack<typeof field.options>>}
        />
      );
    case "switch":
      return <StandardSwitch field={field as StandardSwitchProps} />;
    case "file-upload":
      return <StandardFileUpload field={field as StandardFileUploadProps} />;
    case "image-picker":
      return <StandardImagePicker field={field as StandardImagePickerProps} />;
    case "rating":
      return <StandardRating field={field as StandardRatingProps} />;
    case "counter":
      return <StandardCounter field={field as StandardCounterProps} />;
    case "display-text":
      return <Title field={field} />;
    case "display-image":
      let f: any = field as StandardDisplayImageProps;
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
    // return await renderReactPlayer(field as StandardDisplayMediaProps);
    case "rich-text":
      return <StandardEditor field={field as StandardEditorProps} />;
    case "custom":
      return field.customComponent!(field as any);
    case "text-field":
    default:
      return <StandardTextField field={field as StandardTextFieldProps} />;
  }
}

interface Error {
  attribute: string;
  type: string;
  message: string;
}

interface FormBuilderProps {
  title?: string;
  fields: Array<FieldProp>;
  defaultValue: FieldValues;
  children?: React.ReactNode;
  index?: string | number;
  idPrefix?: string;
  className?: string;
  onSubmit: SubmitHandler<FieldValues>;
  submitButton?: React.ReactNode;
  errors?: Array<Error>;
}

function FormBuilder(props: FormBuilderProps) {
  const {
    title,
    fields,
    defaultValue,
    children,
    index,
    idPrefix,
    onSubmit,
    submitButton,
    errors,
  } = props;
  const { schema } = useValidation(fields);
  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

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
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Box
          key={String(index)}
          className={props.className}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Grid container spacing={1}>
            {title && (
              <Grid item xs={12}>
                <Typography variant="h6">{title}</Typography>
              </Grid>
            )}

            {fields?.map((field, index) => {
              field = handleField(field, index, idPrefix);
              // const component = await getFormComponent(field);
              return (
                !field.hideCondition && (
                  <Grid
                    key={field.attribute || index}
                    item
                    {...sanitizeColProps(field.col)}
                    {...field.containerProps}
                  >
                    {getFormComponent(field)}
                  </Grid>
                )
              );
            })}
          </Grid>

          {children}
        </Box>
        {submitButton ? submitButton : <Button type="submit">Submit</Button>}
      </form>
    </FormProvider>
  );
}

export { FormBuilder };
