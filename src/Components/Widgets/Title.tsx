import React, { DetailedHTMLProps, forwardRef } from "react";

import { Box, BoxProps, Typography, TypographyProps, TypographyTypeMap } from "@mui/material";

export interface TitleProps {
  title: string;
  titleProps?: TypographyProps;
  titleContainerProps?: BoxProps;
  titleSuffixComponent?: JSX.Element;
  titleSuffix?: string;
  titleSuffixProps?: DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >;
}

const Title = forwardRef(
  (props: TitleProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      title,
      titleProps,
      titleContainerProps,
      titleSuffixComponent,
      titleSuffix,
      titleSuffixProps,
    } = props;

    return (
      <Box
        ref={ref}
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
  }
);

export { Title };
