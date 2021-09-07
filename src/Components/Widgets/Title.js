import { Typography } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";

export default function Title(props) {
  const { field } = props;
  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>
      <Typography {...field.titleProps}>{field.title}</Typography>
      {field.titleSuffix && (
        <Typography {...field.titleSuffixProps}>{field.titleSuffix}</Typography>
      )}
    </div>
  );
}

Title.propTypes = {
  field: PropTypes.object,
};
