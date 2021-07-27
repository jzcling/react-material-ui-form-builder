import { TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import useBaseStyles from "../../Hooks/useBaseStyles";
import _ from "lodash";

function StandardTextField(props) {
  const baseClasses = useBaseStyles();
  const { field, form, updateForm } = props;

  return (
    <TextField
      id={field.id || field.attribute}
      classes={{
        root: baseClasses.mt0,
      }}
      fullWidth
      variant="outlined"
      margin="dense"
      label={field.label}
      value={_.get(form, field.attribute) || ""}
      onChange={
        (field.props && field.props.onChange) ||
        ((event) => updateForm(field.attribute, event.target.value))
      }
      InputLabelProps={{
        shrink: !!_.get(form, field.attribute),
      }}
      {...field.props}
    />
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
