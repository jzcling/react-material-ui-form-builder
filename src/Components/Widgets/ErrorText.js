import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import PropTypes from "prop-types";

export default function ErrorText(props) {
  const { error } = props;
  const theme = useTheme();

  return (
    <Typography
      sx={{
        mt: "4px",
        mx: "14px",
        fontSize: "0.75rem",
        color: theme.palette.error.main,
      }}
    >
      {error}
    </Typography>
  );
}

ErrorText.propTypes = {
  error: PropTypes.string,
};
