import React, { Fragment } from "react";
import { makeStyles, TextField, Typography } from "@material-ui/core";
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
      onChange: (event) => {
        var value = event.target.value;
        if (field.props && field.props.type === "number") {
          value = Number(value);
        }
        updateForm(field.attribute, value);
      },
      InputLabelProps: {
        shrink: !!_.get(form, field.attribute),
      },
      ...(field.props || {}),
    };
  };

  return (
    <Fragment>
      {field.title && (
        <Typography {...field.titleProps}>{field.title}</Typography>
      )}
      <TextField {...componentProps(field)} />
    </Fragment>
  );
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
