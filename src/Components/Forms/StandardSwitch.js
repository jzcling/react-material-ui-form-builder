import React, { forwardRef, useCallback } from "react";
import {
  Switch,
  FormControlLabel,
  FormHelperText,
  FormControl,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Fragment } from "react";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";

const useStyles = makeStyles((theme) => ({
  label: {
    margin: theme.spacing(1, 0),
  },
}));

const StandardSwitch = forwardRef((props, ref) => {
  const classes = useStyles();
  const { field, form, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("boolean", field);

  const handleSwitchChange = useCallback(
    (checked) => {
      if (checked) {
        updateForm({ [field.attribute]: checked });
      } else {
        updateForm({ [field.attribute]: undefined });
      }
    },
    [updateForm, field.attribute]
  );

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
      {showTitle && field.title && <Title field={field} form={form} />}
      <FormControl error={errors?.length > 0}>
        <FormControlLabel
          inputRef={(el) => {
            if (el && ref) {
              el.validate = (value) => validate(value);
              ref(el);
            }
          }}
          key={field.id}
          control={<Switch {...componentProps(field)} />}
          label={field.label}
          className={classes.label}
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
  showTitle: true,
};

StandardSwitch.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardSwitch };
