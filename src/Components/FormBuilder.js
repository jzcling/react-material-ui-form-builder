import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Grid, Typography } from "@material-ui/core";
import StandardDatePicker from "./Forms/StandardDatePicker";
import StandardTextField from "./Forms/StandardTextField";
import StandardSelect from "./Forms/StandardSelect";
import StandardAutocomplete from "./Forms/StandardAutocomplete";
import useBaseStyles from "../Hooks/useBaseStyles";

const sanitizeCol = (col) => {
  col = col || {};
  return {
    xs: col.xs,
    sm: col.sm,
    md: col.md,
    lg: col.lg,
    xl: col.xl,
  };
};

function FormBuilder(props) {
  const { title, fields, form, updateForm, children, index, idPrefix } = props;
  const baseClasses = useBaseStyles();

  const getFormComponent = (field) => {
    field.id = field.attribute;
    if (index) {
      field.id = index + "-" + field.id;
    }
    if (idPrefix) {
      field.id = idPrefix + "-" + field.id;
    }

    switch (field.component) {
      case "date-picker":
        return (
          <StandardDatePicker
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
      case "custom":
        return field.customComponent(form, updateForm);
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
      className={clsx(baseClasses.flex, props.className)}
    >
      <Grid container spacing={1}>
        {title && (
          <Grid item xs={12}>
            <Typography variant="h6">{title}</Typography>
          </Grid>
        )}

        {fields.map(
          (field) =>
            !field.hideCondition && (
              <Grid key={field.attribute} item {...sanitizeCol(field.col)}>
                {getFormComponent(field)}
              </Grid>
            )
        )}
      </Grid>

      {children}
    </div>
  );
}

FormBuilder.defaultProps = {
  updateForm: () => {},
  index: null,
  idPrefix: null,
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
