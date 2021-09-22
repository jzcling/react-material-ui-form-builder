import { Typography } from "@material-ui/core";
import React, { forwardRef, useMemo } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";

const Title = forwardRef((props, ref) => {
  const { field, form } = props;

  const title = useMemo(() => {
    if (field.formula) {
      var sub = field.formula.replace(/@\w*/g, (match) =>
        parseFloat(get(form, match.replace("@", "")))
      );
      try {
        return eval(sub) || "";
      } catch (error) {
        return "";
      }
    }
    sub = field.title.replace(/@\w*/g, (match) =>
      get(form, match.replace("@", ""))
    );
    try {
      return sub || "";
    } catch (error) {
      return field.title || "";
    }
  }, [field.formula, field.title, form]);

  return (
    <div ref={ref} style={{ display: "flex", alignItems: "baseline" }}>
      <Typography {...field.titleProps}>{title}</Typography>
      <div style={{ width: "2px" }} />
      {field.titleSuffixComponent
        ? field.titleSuffixComponent
        : field.titleSuffix && (
            <Typography {...field.titleSuffixProps}>
              {field.titleSuffix}
            </Typography>
          )}
    </div>
  );
});

Title.displayName = "Title";

Title.propTypes = {
  field: PropTypes.object,
  form: PropTypes.object,
};

export { Title };
