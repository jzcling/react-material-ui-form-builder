import React from "react";
import PropTypes from "prop-types";
import { StandardAutocomplete } from "./Forms/StandardAutocomplete";
import { StandardAutocompleteNoDrag } from "./Forms/StandardAutocompleteNoDrag";
import { StandardCheckboxGroup } from "./Forms/StandardCheckboxGroup";
import { StandardChipGroup } from "./Forms/StandardChipGroup";
import { StandardCounter } from "./Forms/StandardCounter";
import { StandardDatePicker } from "./Forms/StandardDatePicker";
import { StandardDateTimePicker } from "./Forms/StandardDateTimePicker";
import { StandardFileUpload } from "./Forms/StandardFileUpload";
import { StandardRadioGroup } from "./Forms/StandardRadioGroup";
import { StandardRating } from "./Forms/StandardRating";
import { StandardSelect } from "./Forms/StandardSelect";
import { StandardSwitch } from "./Forms/StandardSwitch";
import { StandardTextField } from "./Forms/StandardTextField";
import { StandardTimePicker } from "./Forms/StandardTimePicker";
import { StandardEditor } from "./Forms/StandardEditor";
import { StandardImagePicker } from "./Forms/StandardImagePicker";
import { Title } from "./Widgets/Title";
import ReactPlayer from "react-player";
import get from "lodash/get";
import { Grid, Typography } from "@mui/material";

function sanitizeColProps(col) {
  col = col || {};
  return {
    xs: col.xs || 12,
    sm: col.sm,
    md: col.md,
    lg: col.lg,
    xl: col.xl,
  };
}

const FormBuilder = (props) => {
  const { title, fields, form, updateForm, refs, children, index, idPrefix } =
    props;

  const handleField = (field) => {
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

  const ref = (field) => (el) => {
    if (refs) {
      refs.current[field.attribute] = el;
    }
  };

  const getFormComponent = (field) => {
    switch (field.component) {
      case "date-picker":
        return (
          <StandardDatePicker
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
      case "date-time-picker":
        return (
          <StandardDateTimePicker
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
      case "time-picker":
        return (
          <StandardTimePicker
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
      case "select":
        return (
          <StandardSelect
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
      case "autocomplete-dnd":
        return (
          <StandardAutocomplete
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );

      case "autocomplete":
        return (
          <StandardAutocompleteNoDrag
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
      case "chip-group":
        return (
          <StandardChipGroup
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
      case "checkbox-group":
        return (
          <StandardCheckboxGroup
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
      case "radio-group":
        return (
          <StandardRadioGroup
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
      case "switch":
        return (
          <StandardSwitch
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
      case "file-upload":
        return (
          <StandardFileUpload
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
      case "image-picker":
        return (
          <StandardImagePicker
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
      case "rating":
        return (
          <StandardRating
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
      case "counter":
        return (
          <StandardCounter
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
      case "display-text":
        return <Title field={field} value={get(form, field.attribute)} />;
      case "display-image":
        return (
          <div
            ref={ref(field)}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <img
              src={field.src}
              alt={field.alt}
              title={field.alt}
              {...field.props}
              loading="lazy"
            />
          </div>
        );
      case "display-media":
        return (
          <div
            ref={ref(field)}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <ReactPlayer
              url={field.src}
              controls
              width={field.width}
              height={field.height}
              {...field.props}
            />
          </div>
        );
      case "rich-text":
        return (
          <StandardEditor
            ref={ref(field)}
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
          />
        );
      case "custom":
        return field.customComponent(
          field,
          get(form, field.attribute),
          updateForm,
          ref
        );
      case "text-field":
      default:
        return (
          <StandardTextField
            field={field}
            value={get(form, field.attribute)}
            updateForm={updateForm}
            ref={ref(field)}
          />
        );
    }
  };

  return (
    <div
      key={String(index) || false}
      className={props.className}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Grid container spacing={1}>
        {title && (
          <Grid item xs={12}>
            <Typography variant="h6">{title}</Typography>
          </Grid>
        )}

        {(fields || []).map((field, index) => {
          field = handleField(field);
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
    </div>
  );
};

FormBuilder.displayName = "FormBuilder";

FormBuilder.defaultProps = {
  updateForm: () => {},
};

FormBuilder.propTypes = {
  title: PropTypes.node,
  fields: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
  refs: PropTypes.object,
  children: PropTypes.node,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  idPrefix: PropTypes.string,
  className: PropTypes.object,
};

export { FormBuilder };
