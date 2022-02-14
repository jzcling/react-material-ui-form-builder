import React, {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TextField } from "@mui/material";
import { debounce } from "@mui/material/utils";
import PropTypes from "prop-types";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";
import { getValidationType } from "../Utils/helpers";

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

const debounceTimeout = 200;

const StandardTextField = forwardRef((props, ref) => {
  const { field, value, updateForm, showTitle } = props;
  const { errors, validate } = useValidation(
    getValidationType(field),
    field.validations,
    getValidations(field)
  );

  const inputRef = useRef();

  const [thisValue, setThisValue] = useState(value || "");
  const [focus, setFocus] = useState();

  const getValue = useCallback(
    (value) => {
      if (value === null || value === undefined) {
        return "";
      }
      if (field.manipulator) {
        return field.manipulator(value);
      }
      return value;
    },
    [field.manipulator]
  );

  useEffect(() => {
    if (getValue(value) !== getValue(thisValue)) {
      debouncedUpdateForm(field, thisValue);
    }
  }, [thisValue]);

  const debouncedUpdateForm = useMemo(
    () =>
      debounce((field, value) => {
        if (field.props && field.props.type === "number") {
          if (value === "" || value === null || value === undefined) {
            value = undefined;
          } else {
            value = Number(value);
          }
        }
        updateForm({ [field.attribute]: value });
      }, field.debounceTimeout || debounceTimeout),
    [updateForm]
  );

  useEffect(() => {
    if (!focus && getValue(thisValue) !== getValue(value)) {
      setThisValue(getValue(value));
    }
  }, [value]);

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      fullWidth: true,
      variant: "outlined",
      size: "small",
      label: field.label,
      value: thisValue,
      onChange: (event) => {
        setThisValue(getValue(event.target.value));
      },
      error: errors?.length > 0,
      helperText: errors[0],
      onFocus: () => {
        setFocus(true);
      },
      onBlur: () => {
        setFocus();
        validate(value);
      },
      onKeyDown: (event) => {
        if (event.which === 13) {
          validate(value);
        }
      },
      InputLabelProps: {
        shrink: !!thisValue || thisValue === 0 || !!value || value === 0,
      },
      ...field.props,
    };
  };

  return (
    <Fragment>
      {showTitle && field.title && <Title field={field} />}
      <TextField
        inputRef={(el) => {
          if (el && ref) {
            el.validate = (value) => validate(value);
            ref(el);
          }
          inputRef.current = el;
        }}
        {...componentProps(field)}
      />
    </Fragment>
  );
});

StandardTextField.displayName = "StandardTextField";

StandardTextField.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardTextField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardTextField };
