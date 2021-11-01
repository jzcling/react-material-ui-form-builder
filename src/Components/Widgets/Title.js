import { Typography } from "@mui/material";
import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const Title = forwardRef((props, ref) => {
  const { field } = props;

  return (
    <div
      ref={ref}
      {...field.titleContainerProps}
      style={{
        display: "flex",
        alignItems: "baseline",
        ...field.titleContainerProps?.style,
      }}
    >
      <Typography {...field.titleProps}>
        {field.title}{" "}
        {field.titleSuffixComponent
          ? field.titleSuffixComponent
          : field.titleSuffix && (
              <span {...field.titleSuffixProps}>{field.titleSuffix}</span>
            )}
      </Typography>
    </div>
  );
});

Title.displayName = "Title";

Title.propTypes = {
  field: PropTypes.object,
  form: PropTypes.object,
};

export { Title };
