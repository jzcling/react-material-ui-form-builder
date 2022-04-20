import React from "react";
import { Controller, ControllerRenderProps, UseFormReturn } from "react-hook-form";

import { Star, StarBorder } from "@mui/icons-material";
import { Box, Rating, RatingProps } from "@mui/material";

import { CommonFieldProps, RatingFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title } from "./widgets/Title";

export interface StandardRatingProps
  extends CommonFieldProps<"rating">,
    RatingFieldProps {
  attribute: Required<CommonFieldProps<"rating">>["attribute"];
}

export default function StandardRating(props: {
  field: StandardRatingProps;
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

  const componentProps = (
    fieldConfig: StandardRatingProps,
    field: ControllerRenderProps
  ): RatingProps => {
    return {
      id: fieldConfig.id || fieldConfig.attribute,
      name: field.name,
      value: field.value || 0,
      precision: 0.5,
      icon: <Star style={{ margin: "0 8px", fontSize: "32px" }} />,
      emptyIcon: <StarBorder style={{ margin: "0 8px", fontSize: "32px" }} />,
      onChange: (event, value) => setValue(fieldConfig.attribute, value),
      sx: {
        "& .MuiRating-iconFilled": {
          color: fieldConfig.iconColor,
        },
      },
      ...fieldConfig.props,
    };
  };

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      render={({ field }) => (
        <Box>
          {!hideTitle && fieldConfig.title && <Title field={fieldConfig} />}
          <Rating {...componentProps(fieldConfig, field)} />
          {!!errors[fieldConfig.attribute] && (
            <ErrorText error={errors[fieldConfig.attribute]?.message} />
          )}
        </Box>
      )}
    />
  );
}
