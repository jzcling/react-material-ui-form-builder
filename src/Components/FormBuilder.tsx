import React, { useEffect } from "react";
import {
  FormProvider, Path, SubmitHandler, useForm, UseFormProps, UseFormReturn
} from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import loadable from "@loadable/component";
import { Box, Button, Grid, Typography } from "@mui/material";

import { getFormSchema } from "../utils/validation";
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

function handleField(
  field: FieldProp,
  index?: string | number,
  idPrefix?: string
): FieldProp {
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
      return <StandardDatePicker field={field} />;
    case "date-time-picker":
      return <StandardDateTimePicker field={field} />;
    case "time-picker":
      return <StandardTimePicker field={field} />;
    case "select":
      return <StandardSelect field={field} />;
    case "autocomplete":
      return <StandardAutocomplete field={field} />;
    case "chip-group":
      return <StandardChipGroup field={field} />;
    case "checkbox-group":
      return <StandardCheckboxGroup field={field} />;
    case "radio-group":
      return <StandardRadioGroup field={field} />;
    case "switch":
      return <StandardSwitch field={field} />;
    case "file-upload":
      return <StandardFileUpload field={field} />;
    case "image-picker":
      return <StandardImagePicker field={field} />;
    case "rating":
      return <StandardRating field={field} />;
    case "counter":
      return <StandardCounter field={field} />;
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
      return <StandardEditor field={field} />;
    case "custom":
      return field.customComponent!(field as any);
    case "text-field":
    default:
      return <StandardTextField field={field} />;
  }
}

interface Error<T> {
  attribute: Path<T>;
  type: string;
  message: string;
}

interface FormBuilderProps<TForm> {
  title?: string;
  fields: Array<FieldProp>;
  defaultValue: UseFormProps<TForm>["defaultValues"];
  children?: React.ReactNode;
  index?: string | number;
  idPrefix?: string;
  className?: string;
  onSubmit: SubmitHandler<TForm>;
  submitButton?: React.ReactNode;
  errors?: Array<Error<TForm>>;
  setMethods?: (methods: UseFormReturn<TForm>) => void;
}

function FormBuilder<TForm>(props: FormBuilderProps<TForm>) {
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
    setMethods,
  } = props;
  const schema = getFormSchema(fields);
  const methods = useForm<TForm>({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    methods.reset(defaultValue);
  }, [defaultValue]);

  // emit methods on change
  useEffect(() => {
    if (setMethods) {
      setMethods(methods);
    }
  }, [methods]);

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
                    {/* <Suspense fallback={<Skeleton />}> */}
                    {getFormComponent(field)}
                    {/* </Suspense> */}
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
