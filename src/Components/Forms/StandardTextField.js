import React from "react";
import { makeStyles, TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  textFieldRoot: {
    marginTop: 0,
  },
}));

function StandardTextField(props) {
  const classes = useStyles();
  const { field, form, updateForm } = props;

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
      value: _.get(form, field.attribute) || "",
      onChange: (event) => updateForm(field.attribute, event.target.value),
      InputLabelProps: {
        shrink: !!_.get(form, field.attribute),
      },
      ...(field.props || {}),
    };
  };

  return <TextField {...componentProps(field)} />;
}

StandardTextField.defaultProps = {
  updateForm: () => {},
};

StandardTextField.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardTextField;
