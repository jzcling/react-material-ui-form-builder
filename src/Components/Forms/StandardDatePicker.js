import MomentUtils from "@date-io/moment";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import PropTypes from "prop-types";
import useBaseStyles from "../../Hooks/useBaseStyles";
import _ from "lodash";

function StandardDatePicker(props) {
  const baseClasses = useBaseStyles();
  const { field, form, updateForm } = props;

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDatePicker
        id={field.id || field.attribute}
        className={baseClasses.my0}
        disableToolbar
        fullWidth
        variant="inline"
        inputVariant="outlined"
        margin="dense"
        format="DD/MM/YYYY"
        label={field.label}
        value={_.get(form, field.attribute) || null}
        onChange={
          (field.props && field.props.onChange) ||
          ((value) => updateForm(field.attribute, value.format("YYYY-MM-DD")))
        }
        KeyboardButtonProps={{
          "aria-label": field.label,
        }}
        InputProps={{
          className: baseClasses.pr0,
        }}
        {...field.props}
      />
    </MuiPickersUtilsProvider>
  );
}

StandardDatePicker.defaultProps = {
  updateForm: () => {},
};

StandardDatePicker.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardDatePicker;
