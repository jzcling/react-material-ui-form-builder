import { Typography } from "@material-ui/core";
import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const Title = forwardRef((props, ref) => {
  const { field } = props;
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "baseline" }}>
      <Typography {...field.titleProps}>{field.title}</Typography>
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
};

export default Title;
