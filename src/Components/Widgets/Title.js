import { Typography } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";

export default function Title(props) {
  const { field } = props;
  return (
    <>
      <Typography {...field.titleProps}>{field.title}</Typography>
      {field.titleSuffix && (
        <Typography {...field.titleSuffixProps}>{field.titleSuffix}</Typography>
      )}
    </>
  );
}

Title.propTypes = {
  field: PropTypes.object,
};
