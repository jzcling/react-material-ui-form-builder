import React, { forwardRef } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import StandardAutocomplete from "./Forms/StandardAutocomplete";
import StandardCheckboxGroup from "./Forms/StandardCheckboxGroup";
import StandardChipGroup from "./Forms/StandardChipGroup";
import StandardDatePicker from "./Forms/StandardDatePicker";
import StandardDateTimePicker from "./Forms/StandardDateTimePicker";
import StandardFileUpload from "./Forms/StandardFileUpload";
import StandardRadioGroup from "./Forms/StandardRadioGroup";
import StandardSelect from "./Forms/StandardSelect";
import StandardSwitch from "./Forms/StandardSwitch";
import StandardTextField from "./Forms/StandardTextField";
import StandardTimePicker from "./Forms/StandardTimePicker";
import ReactPlayer from "react-player";
import StandardEditor from "./Forms/StandardEditor";
import StandardImagePicker from "./Forms/StandardImagePicker";

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

const useStyles = makeStyles(() => ({
  flex: {
    display: "flex",
    alignItems: "center",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
  },
}));

const FormBuilder = forwardRef((props, ref) => {
  const { title, fields, form, updateForm, children, index, idPrefix } = props;
  const classes = useStyles();

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

  const getFormComponent = (field) => {
    switch (field.component) {
      case "date-picker":
        return (
          <StandardDatePicker
            field={field}
            form={form}
            updateForm={updateForm}
            ref={ref}
          />
        );
      case "date-time-picker":
        return (
          <StandardDateTimePicker
            field={field}
            form={form}
            updateForm={updateForm}
            ref={ref}
          />
        );
      case "time-picker":
        return (
          <StandardTimePicker
            field={field}
            form={form}
            updateForm={updateForm}
            ref={ref}
          />
        );
      case "select":
        return (
          <StandardSelect
            field={field}
            form={form}
            updateForm={updateForm}
            ref={ref}
          />
        );
      case "autocomplete":
        return (
          <StandardAutocomplete
            field={field}
            form={form}
            updateForm={updateForm}
            ref={ref}
          />
        );
      case "chip-group":
        return (
          <StandardChipGroup
            field={field}
            form={form}
            updateForm={updateForm}
            ref={ref}
          />
        );
      case "checkbox-group":
        return (
          <StandardCheckboxGroup
            field={field}
            form={form}
            updateForm={updateForm}
            ref={ref}
          />
        );
      case "radio-group":
        return (
          <StandardRadioGroup
            field={field}
            form={form}
            updateForm={updateForm}
            ref={ref}
          />
        );
      case "switch":
        return (
          <StandardSwitch
            field={field}
            form={form}
            updateForm={updateForm}
            ref={ref}
          />
        );
      case "file-upload":
        return (
          <StandardFileUpload
            field={field}
            form={form}
            updateForm={updateForm}
            ref={ref}
          />
        );
      case "image-picker":
        return (
          <StandardImagePicker
            field={field}
            form={form}
            updateForm={updateForm}
            ref={ref}
          />
        );
      case "display-text":
        return (
          <Typography ref={ref} {...field.titleProps}>
            {field.title}
          </Typography>
        );
      case "display-image":
        return (
          <div ref={ref} className={classes.imageContainer}>
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
          <div ref={ref} style={{ display: "flex", justifyContent: "center" }}>
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
            ref={ref}
            field={field}
            form={form}
            updateForm={updateForm}
          />
        );
      case "custom":
        return field.customComponent(field, form, updateForm, ref);
      case "text-field":
      default:
        return (
          <StandardTextField
            field={field}
            form={form}
            updateForm={updateForm}
            ref={ref}
          />
        );
    }
  };

  return (
    <div
      key={String(index) || false}
      className={clsx(classes.flex, props.className)}
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
});

FormBuilder.displayName = "FormBuilder";

FormBuilder.defaultProps = {
  updateForm: () => {},
};

FormBuilder.propTypes = {
  title: PropTypes.node,
  fields: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
  children: PropTypes.node,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  idPrefix: PropTypes.string,
  className: PropTypes.object,
};

export default FormBuilder;
