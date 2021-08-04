import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Grid, makeStyles, Typography } from "@material-ui/core";
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

const useStyles = makeStyles((theme) => ({
  flex: {
    display: "flex",
    alignItems: "center",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
  },
}));

function FormBuilder(props) {
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
          />
        );
      case "date-time-picker":
        return (
          <StandardDateTimePicker
            field={field}
            form={form}
            updateForm={updateForm}
          />
        );
      case "select":
        return (
          <StandardSelect field={field} form={form} updateForm={updateForm} />
        );
      case "autocomplete":
        return (
          <StandardAutocomplete
            field={field}
            form={form}
            updateForm={updateForm}
          />
        );
      case "chip-group":
        return (
          <StandardChipGroup
            field={field}
            form={form}
            updateForm={updateForm}
          />
        );
      case "checkbox-group":
        return (
          <StandardCheckboxGroup
            field={field}
            form={form}
            updateForm={updateForm}
          />
        );
      case "radio-group":
        return (
          <StandardRadioGroup
            field={field}
            form={form}
            updateForm={updateForm}
          />
        );
      case "switch":
        return (
          <StandardSwitch field={field} form={form} updateForm={updateForm} />
        );
      case "file-upload":
        return (
          <StandardFileUpload
            field={field}
            form={form}
            updateForm={updateForm}
          />
        );
      case "display-text":
        return <Typography {...field.titleProps}>{field.title}</Typography>;
      case "display-image":
        return (
          <div className={classes.imageContainer}>
            <img
              src={field.src}
              alt={field.alt}
              {...field.props}
              loading="lazy"
            />
          </div>
        );
      case "custom":
        return field.customComponent(field, form, updateForm);
      case "text-field":
      default:
        return (
          <StandardTextField
            field={field}
            form={form}
            updateForm={updateForm}
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

        {fields.map((field, index) => {
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
}

FormBuilder.defaultProps = {
  updateForm: (key, value) => {},
};

FormBuilder.propTypes = {
  title: PropTypes.node,
  fields: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
  children: PropTypes.node,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  idPrefix: PropTypes.string,
};

export default FormBuilder;
