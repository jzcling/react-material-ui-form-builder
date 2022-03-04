import React, { DetailedHTMLProps } from "react";

import { Box, BoxProps, Typography, TypographyProps, TypographyTypeMap } from "@mui/material";

export interface TitleProps {
  title?: string;
  titleProps?: TypographyProps;
  titleContainerProps?: BoxProps;
  titleSuffixComponent?: React.ReactNode;
  titleSuffix?: string;
  titleSuffixProps?: DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >;
}

const Title = (props: { field: TitleProps }) => {
  const {
    field: {
      title,
      titleProps,
      titleContainerProps,
      titleSuffixComponent,
      titleSuffix,
      titleSuffixProps,
    },
  } = props;

  return (
    <Box
      {...titleContainerProps}
      sx={{
        display: "flex",
        alignItems: "baseline",
        ...titleContainerProps?.sx,
      }}
    >
      <Typography {...titleProps}>
        {title}{" "}
        {titleSuffixComponent ||
          (titleSuffix && <span {...titleSuffixProps}>{titleSuffix}</span>)}
      </Typography>
    </Box>
  );
};

export { Title };
