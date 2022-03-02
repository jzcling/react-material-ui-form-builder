import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Typography } from "@mui/material";

import { useValidation } from "../hooks/useValidation";
import {
  GridColMap, StandardDisplayImageProps, StandardDisplayMediaProps
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
) => {
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
  | StandardAutocompleteProps
  | StandardCheckboxGroupProps
  | StandardChipGroupProps
  | StandardCounterProps
  | StandardDatePickerProps
  | StandardDateTimePickerProps
  | StandardEditorProps
  | StandardFileUploadProps
  | StandardImagePickerProps
  | StandardRadioGroupProps
  | StandardRatingProps
  | StandardSelectProps
  | StandardSwitchProps
  | StandardTextFieldProps
  | StandardTimePickerProps
  | StandardDisplayImageProps
  | StandardDisplayMediaProps;

interface FormBuilderProps {
  title?: string;
  fields: Array<FieldProp>;
  initForm: Record<string, unknown>;
  children?: React.ReactNode;
  index?: string | number;
  idPrefix?: string;
  className: string;
  onSubmit: (form: Record<string, unknown>) => void;
}

function FormBuilder(props: FormBuilderProps) {
  const { title, fields, initForm, children, index, idPrefix, onSubmit } =
    props;
  const { schema } = useValidation(fields);
  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    methods.reset(initForm);
  }, [initForm]);

  const getFormComponent = (field: FieldProp) => {
    switch (field.component) {
      case "date-picker":
        return <StandardDatePicker field={field as StandardDatePickerProps} />;
      case "date-time-picker":
        return (
          <StandardDateTimePicker
            field={field as StandardDateTimePickerProps}
          />
        );
      case "time-picker":
        return <StandardTimePicker field={field as StandardTimePickerProps} />;
      case "select":
        return <StandardSelect field={field as StandardSelectProps} />;
      case "autocomplete":
        return (
          <StandardAutocomplete field={field as StandardAutocompleteProps} />
        );
      case "chip-group":
        return <StandardChipGroup field={field as StandardChipGroupProps} />;
      case "checkbox-group":
        return (
          <StandardCheckboxGroup field={field as StandardCheckboxGroupProps} />
        );
      case "radio-group":
        return <StandardRadioGroup field={field as StandardRadioGroupProps} />;
      case "switch":
        return <StandardSwitch field={field as StandardSwitchProps} />;
      case "file-upload":
        return <StandardFileUpload field={field as StandardFileUploadProps} />;
      case "image-picker":
        return (
          <StandardImagePicker field={field as StandardImagePickerProps} />
        );
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
        return renderReactPlayer(field as StandardDisplayMediaProps);
      case "rich-text":
        return <StandardEditor field={field as StandardEditorProps} />;
      case "custom":
        return field.customComponent!(field as any);
      case "text-field":
      default:
        return <StandardTextField field={field as StandardTextFieldProps} />;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
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
              return (
                !field.hideCondition && (
                  <Grid
                    key={field.id || index}
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
      </form>
    </FormProvider>
  );
}

export { FormBuilder };
