import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import { Add, Remove } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";

import { CommonFieldProps, CounterFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title } from "./widgets/Title";

export interface StandardCounterProps
  extends CommonFieldProps<"counter">,
    CounterFieldProps {
  attribute: Required<CommonFieldProps<"counter">>["attribute"];
}

export default function StandardCounter(props: {
  field: StandardCounterProps;
  methods: UseFormReturn;
  hideTitle?: boolean;
}) {
  const {
    field: fieldConfig,
    methods: {
      control,
      getValues,
      setValue,
      trigger,
      formState: { errors },
    },
    hideTitle,
  } = props;

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      render={({ field }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {!hideTitle && fieldConfig.title && <Title field={fieldConfig} />}
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
}
