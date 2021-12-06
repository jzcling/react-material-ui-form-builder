import { ButtonBase, Card, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { Fragment } from "react";
import PropTypes from "prop-types";

export default function CustomChip(props) {
  const {
    label,
    subLabel,
    labelProps,
    subLabelProps,
    active,
    onClick,
    sx,
    disabled,
    content,
  } = props;

  return (
    <Card
      variant="outlined"
      onClick={disabled ? null : onClick}
      sx={
        active
          ? {
              backgroundColor: (theme) => theme.palette.primary.main,
              color: "white",
              ...sx,
            }
          : {
              backgroundColor: disabled ? grey[400] : "transparent",
              ...sx,
            }
      }
    >
      <ButtonBase
        sx={{
          display: "block",
          "& .MuiPaper-root": {
            p: 0,
          },
        }}
      >
        {content ? (
          content
        ) : (
          <>
            <Typography {...labelProps}>{label}</Typography>
            <Typography {...subLabelProps}>
              {subLabel.split("\n").map((text, index) => {
                if (index === 0) {
                  return <span key={index}>{text}</span>;
                }
                return (
                  <Fragment key={index}>
                    <br />
                    <span>{text}</span>
                  </Fragment>
                );
              })}
            </Typography>
          </>
        )}
      </ButtonBase>
    </Card>
  );
}

CustomChip.propTypes = {
  label: PropTypes.string,
  subLabel: PropTypes.string,
  labelProps: PropTypes.object,
  subLabelProps: PropTypes.object,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  sx: PropTypes.object,
  content: PropTypes.node,
};
