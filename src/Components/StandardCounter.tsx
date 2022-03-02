import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Add, Remove } from "@mui/icons-material";
import { Box, BoxProps, IconButton, Tooltip, Typography } from "@mui/material";

import { getTitleProps } from "../utils";
import { CommonFieldProps, CounterFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title, TitleProps } from "./widgets/Title";

export interface StandardCounterProps
  extends CommonFieldProps,
    CounterFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  props: BoxProps & { disabled?: boolean };
}

const StandardCounter = (props: {
  field: StandardCounterProps;
  showTitle?: boolean;
}) => {
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { field: fieldConfig, showTitle } = props;
  const titleProps: TitleProps = getTitleProps(fieldConfig);

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      defaultValue={getValues(fieldConfig.attribute)}
      render={({ field }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {showTitle && fieldConfig.title && <Title field={fieldConfig} />}
          <Tooltip title="Reduce">
            <span>
              <IconButton
                aria-label="reduce"
                sx={{
                  color: (theme) => theme.palette.primary.light,
                }}
                onClick={() =>
                  setValue(
                    fieldConfig.attribute,
                    Math.max(Number(field.value) - 1, 0)
                  )
                }
                disabled={
                  fieldConfig.props?.disabled ||
                  Number(field.value || 0) <= Number(fieldConfig.inputMin || 0)
                }
                size="large"
              >
                <Remove />
              </IconButton>
            </span>
          </Tooltip>
          <Box
            sx={{
              border: "1px solid #b9b9b9",
              borderRadius: "4px",
              textAlign: "center",
              width: "60px",
              padding: "4px",
              color: "rgba(0, 0, 0, 0.87)",
            }}
            {...fieldConfig.props}
          >
            <Typography sx={{ fontSize: fieldConfig.fontSize }}>
              {Number(field.value || 0)}
            </Typography>
          </Box>
          <Tooltip title="Add">
            <span>
              <IconButton
                aria-label="add"
                sx={{
                  color: (theme) => theme.palette.primary.main,
                }}
                onClick={() =>
                  setValue(fieldConfig.attribute, Number(field.value || 0) + 1)
                }
                disabled={
                  fieldConfig.props?.disabled ||
                  Number(field.value || 0) >=
                    Number(fieldConfig.inputMax || 1000000)
                }
                size="large"
              >
                <Add />
              </IconButton>
            </span>
          </Tooltip>

          {!!errors[fieldConfig.attribute] && (
            <ErrorText error={errors[fieldConfig.attribute].message} />
          )}
        </Box>
      )}
    />
  );
};

export { StandardCounter };
