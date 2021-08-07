import React from "react";
import {
  Switch,
  FormControlLabel,
  Typography,
  FormHelperText,
  FormControl,
} from "@material-ui/core";
import PropTypes from "prop-types";
import _ from "lodash";
import { Fragment } from "react";
import useValidation from "../../Hooks/useValidation";
import { getValidations } from "../../Helpers";

function StandardSwitch(props) {
  const { field, form, updateForm } = props;
  const { errors, validate } = useValidation("mixed", getValidations(field));

  const handleSwitchChange = (checked) => {
    if (checked) {
      updateForm(field.attribute, checked);
    } else {
      updateForm(field.attribute, undefined);
    }
  };

  const componentProps = (field) => {
    const isSelected = !!_.get(form, field.attribute);
    return {
      id: field.id || field.attribute,
      key: field.id,
      size: "small",
      color: "primary",
      checked: isSelected,
      onChange: (event) => handleSwitchChange(event.target.checked),
      onBlur: (event) => validate(_.get(form, field.attribute)),
      ...field.props,
    };
  };

  return (
    <Fragment>
      {field.title && (
        <Typography {...field.titleProps}>{field.title}</Typography>
      )}
      <FormControl fullWidth error={errors.length > 0}>
        <FormControlLabel
          key={field.id}
          control={<Switch {...componentProps(field)} />}
          label={field.label}
          {...field.labelProps}
        />
        <FormHelperText>{errors[0]}</FormHelperText>
      </FormControl>
    </Fragment>
  );
}

StandardSwitch.defaultProps = {
  updateForm: () => {},
};

StandardSwitch.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardSwitch;
