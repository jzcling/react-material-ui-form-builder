import React, { forwardRef, Fragment } from "react";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import get from "lodash/get";
import useValidation from "../../Hooks/useValidation";
import Title from "../Widgets/Title";

const useStyles = makeStyles(() => ({
  textFieldRoot: {
    marginTop: 0,
  },
}));

const getType = (field) => {
  if (field.validationType) {
    return field.validationType;
  }
  if (!(field.props && field.props.type) || field.props.type !== "number") {
    return "string";
  }
  return "number";
};

const getValidations = (field) => {
  var validations = {};
  const type = field.props && field.props.type;
  if (type === "email") {
    validations.email = true;
  }
  if (type === "url") {
    validations.url = true;
  }
  if (field.label) {
    validations.label = field.label;
  }
  validations = { ...validations, ...field.validations };
  return validations;
};

const getValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  return value;
};

const StandardTextField = forwardRef((props, ref) => {
  const classes = useStyles();
  const { field, form, updateForm } = props;
  const { errors, validate } = useValidation(
    getType(field),
    field,
    form,
    updateForm,
    getValidations(field)
  );

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      classes: {
        root: classes.textFieldRoot,
      },
      fullWidth: true,
      variant: "outlined",
      margin: "dense",
      label: field.label,
      value: getValue(get(form, field.attribute)),
      onChange: (event) => {
        var value = event.target.value;
        if (field.props && field.props.type === "number") {
          if (value === "" || value === null || value === undefined) {
            value = undefined;
          } else {
            value = Number(value);
          }
        }
        updateForm(field.attribute, value);
      },
      InputLabelProps: {
        shrink:
          !!get(form, field.attribute) || get(form, field.attribute) === 0,
      },
      error: errors.length > 0,
      helperText: errors[0],
      onBlur: () => validate(get(form, field.attribute)),
      onKeyUp: (event) => {
        if (event.key === "Enter") {
          validate(get(form, field.attribute));
        }
      },
      ...field.props,
    };
  };

  return (
    <Fragment>
      {field.title && <Title field={field} />}
      <TextField inputRef={ref} {...componentProps(field)} />
    </Fragment>
  );
});

StandardTextField.displayName = "StandardTextField";

StandardTextField.defaultProps = {
  updateForm: () => {},
};

StandardTextField.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardTextField;
