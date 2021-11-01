import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import { useValidation } from "../../Hooks/useValidation";
import { Editor } from "@jeremyling/react-material-ui-rich-text-editor";
import { Typography } from "@mui/material";
import ErrorText from "../Widgets/ErrorText";

const StandardEditor = forwardRef((props, ref) => {
  const { field, value, updateForm } = props;
  const [preview, setPreview] = useState();
  const { errors, validate } = useValidation("string", field.validations);
  const [touched, setTouched] = useState(false);

  const thisValue = useMemo(() => value || "", [value]);

  const validateHtml = useCallback(
    (html) => {
      var dom = new DOMParser().parseFromString(html, "text/html");
      const stripped = dom.body.textContent;
      validate(stripped);
    },
    [thisValue]
  );

  useEffect(() => {
    if (touched) {
      validateHtml(thisValue);
    }
  }, [thisValue]);

  return (
    <div
      ref={(el) => {
        if (el && ref) {
          el.validate = (value) => validateHtml(value);
          ref(el);
        }
      }}
      onFocus={() => setTouched(true)}
    >
      <Editor
        html={thisValue}
        document={preview}
        onChange={(document) => setPreview(document)}
        onBlur={(html) => {
          updateForm({ [field.attribute]: html });
        }}
        containerProps={field.groupContainerProps}
        editableProps={field.props}
      />
      {errors?.length > 0 && <ErrorText error={errors[0]} />}
    </div>
  );
});

StandardEditor.displayName = "StandardEditor";

StandardEditor.defaultProps = {
  updateForm: () => {},
};

StandardEditor.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string,
  updateForm: PropTypes.func,
};

export { StandardEditor };
