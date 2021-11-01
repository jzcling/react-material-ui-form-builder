import React, { forwardRef, useCallback } from "react";
import {
  Switch,
  FormControlLabel,
  FormHelperText,
  FormControl,
} from "@mui/material";
import PropTypes from "prop-types";
import { Fragment } from "react";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";

const StandardSwitch = forwardRef((props, ref) => {
  const { field, value, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("mixed", field.validations);

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
    const isSelected = !!value;
    return {
      id: field.id || field.attribute,
      key: field.id,
      size: "small",
      color: "primary",
      checked: isSelected,
      onChange: (event) => handleSwitchChange(event.target.checked),
      onBlur: () => validate(value),
      ...field.props,
    };
  };

  return (
    <Fragment>
      {showTitle && field.title && <Title field={field} />}
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
          style={{ margin: "8px 0" }}
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
  value: PropTypes.bool,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardSwitch };
