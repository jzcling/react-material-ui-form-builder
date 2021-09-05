import React, { forwardRef, useCallback } from "react";
import {
  Switch,
  FormControlLabel,
  Typography,
  FormHelperText,
  FormControl,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Fragment } from "react";
import useValidation from "../../Hooks/useValidation";

const useStyles = makeStyles(() => ({
  ml0: {
    marginLeft: 0,
  },
}));

const StandardSwitch = forwardRef((props, ref) => {
  const classes = useStyles();
  const { field, form, updateForm } = props;
  const { errors, validate } = useValidation("mixed", field, form, updateForm);

  const handleSwitchChange = useCallback((checked) => {
    if (checked) {
      updateForm(field.attribute, checked);
    } else {
      updateForm(field.attribute, undefined);
    }
  }, []);

  const componentProps = (field) => {
    const isSelected = !!get(form, field.attribute);
    return {
      id: field.id || field.attribute,
      key: field.id,
      size: "small",
      color: "primary",
      checked: isSelected,
      onChange: (event) => handleSwitchChange(event.target.checked),
      onBlur: () => validate(get(form, field.attribute)),
      ...field.props,
    };
  };

  return (
    <Fragment>
      {field.title && (
        <Typography {...field.titleProps}>{field.title}</Typography>
      )}
      <FormControl error={errors.length > 0}>
        <FormControlLabel
          inputRef={ref}
          key={field.id}
          control={<Switch {...componentProps(field)} />}
          label={field.label}
          className={classes.ml0}
          {...field.labelProps}
        />
        <FormHelperText>{errors[0]}</FormHelperText>
      </FormControl>
    </Fragment>
  );
});

StandardSwitch.displayName = "StandardSwitch";

StandardSwitch.defaultProps = {
  updateForm: () => {},
};

StandardSwitch.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardSwitch;
