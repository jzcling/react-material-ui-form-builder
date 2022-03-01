import React from "react";

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ErrorProps {
  error: string;
}

export default function ErrorText(props: ErrorProps): JSX.Element {
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
