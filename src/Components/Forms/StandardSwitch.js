import React from "react";
import { Switch, FormControlLabel } from "@material-ui/core";
import PropTypes from "prop-types";
import _ from "lodash";
import { Fragment } from "react";

function StandardSwitchGroup(props) {
  const { field, form, updateForm } = props;

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
      ...(field.props || {}),
    };
  };

  return (
    <Fragment>
      <FormControlLabel
        key={field.id}
        control={<Switch {...componentProps(field)} />}
        label={field.label}
        {...(field.labelProps || {})}
      />
    </Fragment>
  );
}

StandardSwitchGroup.defaultProps = {
  updateForm: () => {},
};

StandardSwitchGroup.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardSwitchGroup;
