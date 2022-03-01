import React, { forwardRef } from "react";
import { Controller, ControllerRenderProps, useFormContext } from "react-hook-form";

import { Star, StarBorder } from "@mui/icons-material";
import { Box, Rating, RatingProps } from "@mui/material";

import { getTitleProps } from "../utils";
import { CommonFieldProps, RatingFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title, TitleProps } from "./widgets/Title";

export interface StandardRatingProps
  extends CommonFieldProps,
    RatingFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  props: RatingProps;
}

const StandardRating = forwardRef(
  (props: { field: StandardRatingProps; showTitle: boolean }, ref) => {
    const {
      control,
      getValues,
      setValue,
      formState: { errors },
    } = useFormContext();
    const { field: fieldConfig, showTitle } = props;
    const titleProps: TitleProps = getTitleProps(fieldConfig);

    const componentProps = (
      fieldConfig: StandardRatingProps,
      field: ControllerRenderProps
    ): RatingProps => {
      return {
        id: fieldConfig.attribute,
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
        defaultValue={getValues(fieldConfig.attribute) || 0}
        render={({ field }) => (
          <Box ref={ref}>
            {showTitle && titleProps.title && <Title {...titleProps} />}
            <Rating {...componentProps(fieldConfig, field)} />
            {!!errors[fieldConfig.attribute] && (
              <ErrorText error={errors[fieldConfig.attribute].message} />
            )}
          </Box>
        )}
      />
    );
  }
);

export { StandardRating };
