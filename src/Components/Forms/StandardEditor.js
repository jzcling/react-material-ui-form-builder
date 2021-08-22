import React, {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import useValidation from "../../Hooks/useValidation";
import Editor from "@jeremyling/react-material-ui-rich-text-editor";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  errorText: {
    marginTop: "4px",
    fontSize: "0.75rem",
    color: theme.palette.error.main,
  },
}));

const StandardEditor = forwardRef((props, ref) => {
  const { field, form, updateForm } = props;
  const classes = useStyles();
  const [preview, setPreview] = useState();
  const { errors, validate } = useValidation("string", field, form, updateForm);
  const [touched, setTouched] = useState(false);

  const value = useMemo(
    () => _.get(form, field.attribute) || "",
    [form, field.attribute]
  );

  const validateHtml = useCallback(
    (html) => {
      var dom = new DOMParser().parseFromString(html, "text/html");
      const stripped = dom.body.textContent;
      validate(stripped);
    },
    [value]
  );

  useEffect(() => {
    if (touched) {
      validateHtml(value);
    }
  }, [value]);

  return (
    <div
      ref={(el) => {
        if (el && ref) {
          el.blur = () => {
            validateHtml(value);
          };
          ref(el);
        }
      }}
      onFocus={(event) => setTouched(true)}
    >
      <Editor
        html={value}
        document={preview}
        onChange={(document) => setPreview(document)}
        onBlur={(html) => {
          updateForm(field.attribute, html);
        }}
        containerProps={field.groupContainerProps}
        editableProps={field.props}
      />
      {errors.length > 0 && (
        <Typography className={classes.errorText}>{errors[0]}</Typography>
      )}
    </div>
  );
});

StandardEditor.defaultProps = {
  updateForm: () => {},
};

StandardEditor.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardEditor;
