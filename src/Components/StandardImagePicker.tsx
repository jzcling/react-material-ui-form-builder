import React, { forwardRef, Fragment, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import {
  Box, ButtonBase, ButtonBaseProps, ImageList, ImageListProps, Typography
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import { useDimensions } from "../hooks/useDimensions";
import { getTitleProps } from "../utils";
import {
  CommonFieldProps, GridColMap, ImagePickerFieldProps, ImagePickerObject
} from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title, TitleProps } from "./widgets/Title";

export interface StandardImagePickerProps
  extends CommonFieldProps,
    ImagePickerFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  props: ButtonBaseProps;
}

type StyledProps = {
  fieldConfig: StandardImagePickerProps;
};

const ImageListRoot = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-around",
  overflow: "hidden",
  cursor: "pointer",
}));

const StyledImageList = styled(ImageList)(() => ({
  width: "100%",
  marginBottom: `2px !important`,
  // Promote into its own layer. Maintains high FPS at a memory cost
  transform: "translateZ(0)",
}));

const ImageContainerRoot = styled("div")(() => ({
  display: "inline-block",
  position: "relative",
  margin: "2px",
  width: "100%",
}));

const ImageContainerSizer = styled("div")<StyledProps>(({ fieldConfig }) => ({
  marginTop: `${
    (Number(fieldConfig.aspectRatio?.[1] || 1) /
      Number(fieldConfig.aspectRatio?.[0] || 1)) *
    100
  }%`,
}));

const ImageContainer = styled(Box)(() => ({
  position: "absolute",
  inset: 0,
}));

const Image = styled("img")(() => ({
  borderRadius: "4px",
  objectFit: "contain",
  width: "100%",
  height: "100%",
  pointerEvents: "none",
}));

const LabelContainer = styled("div")<StyledProps>(({ fieldConfig }) => ({
  margin: "4px",
  overflow: "hidden",
  height: (fieldConfig.labelLines || 2) * (getLabelFontSize(fieldConfig) + 2),
}));

const Label = styled(Typography)<StyledProps>(({ fieldConfig }) => ({
  display: "-webkit-box",
  boxOrient: "vertical",
  lineClamp: fieldConfig.labelLines,
  lineHeight: `${getLabelFontSize(fieldConfig) + 2}px`,
  textAlign: "center",
}));

const SubLabelContainer = styled("div")<StyledProps>(({ fieldConfig }) => ({
  margin: "4px",
  overflow: "hidden",
  height:
    (fieldConfig.subLabelLines || 2) * (getSubLabelFontSize(fieldConfig) + 2),
}));

const SubLabel = styled(Typography)<StyledProps>(({ fieldConfig }) => ({
  display: "-webkit-box",
  boxOrient: "vertical",
  lineClamp: fieldConfig.subLabelLines || 2,
  lineHeight: `${getSubLabelFontSize(fieldConfig) + 2}px`,
  textAlign: "center",
}));

const getLabelFontSize = (fieldConfig: StandardImagePickerProps): number =>
  fieldConfig.labelProps?.style?.fontSize
    ? Number(String(fieldConfig.labelProps?.style?.fontSize).replace("px", ""))
    : 14;

const getSubLabelFontSize = (fieldConfig: StandardImagePickerProps): number =>
  fieldConfig.subLabelProps?.style?.fontSize
    ? Number(
        String(fieldConfig.subLabelProps?.style?.fontSize).replace("px", "")
      )
    : 14;

function sanitizeImageCols(col?: GridColMap): GridColMap {
  const copy = { ...(col || { xs: 2 }) };
  copy.sm = col?.sm || copy.xs;
  copy.md = col?.md || copy.sm;
  copy.lg = col?.lg || copy.md;
  copy.xl = col?.xl || copy.lg;
  return copy;
}

const StandardImagePicker = forwardRef(
  (props: { field: StandardImagePickerProps; showTitle: boolean }, ref) => {
    const {
      control,
      getValues,
      setValue,
      trigger,
      formState: { errors },
    } = useFormContext();
    const { field: fieldConfig, showTitle } = props;
    const titleProps: TitleProps = getTitleProps(fieldConfig);
    const theme = useTheme();
    const { widthType } = useDimensions();

    const getValueKey = useMemo(() => {
      if (fieldConfig.getValueKey) {
        return fieldConfig.getValueKey;
      }
      return (value: ImagePickerObject) => value?.label || value?.src;
    }, [fieldConfig.getValueKey]);

    const getOptionKey = useMemo(() => {
      if (fieldConfig.getOptionKey) {
        return fieldConfig.getOptionKey;
      }
      return (option: ImagePickerObject) => option?.label || option?.src;
    }, [fieldConfig.getOptionKey]);

    const handleClick = (
      option: ImagePickerObject,
      value: ImagePickerObject | Array<ImagePickerObject>
    ) => {
      if (fieldConfig.multiple && Array.isArray(value)) {
        const index = value?.findIndex(
          (value) => getValueKey(value) === getOptionKey(option)
        );
        if (index >= 0) {
          // option is currently selected, so remove it
          let copy: Array<ImagePickerObject> | undefined = [...value];
          copy.splice(index, 1);
          if (copy.length === 0) {
            copy = undefined;
          }
          setValue(fieldConfig.attribute, copy);
          return;
        }
        setValue(fieldConfig.attribute, [...(value || []), option]);
      } else {
        if (getValueKey(value as ImagePickerObject) === getOptionKey(option)) {
          // option currently selected, so remove it
          setValue(fieldConfig.attribute, undefined);
          return;
        }
        setValue(fieldConfig.attribute, option);
      }
    };

    const isSelected = (
      fieldConfig: StandardImagePickerProps,
      option: ImagePickerObject,
      value: ImagePickerObject | Array<ImagePickerObject>
    ) => {
      let isSelected;
      if (fieldConfig.multiple && Array.isArray(value)) {
        isSelected =
          value?.findIndex(
            (value) => getValueKey(value) === getOptionKey(option)
          ) >= 0;
      } else {
        isSelected =
          getValueKey(value as ImagePickerObject) === getOptionKey(option);
      }
      return isSelected;
    };

    const componentProps = (
      fieldConfig: StandardImagePickerProps,
      option: ImagePickerObject,
      value: ImagePickerObject | Array<ImagePickerObject>
    ): ButtonBaseProps => {
      return {
        id: fieldConfig.attribute,
        // component: "div",
        sx: {
          width: `calc(100% - ${
            isSelected(fieldConfig, option, value) ? "12px" : "8px"
          })`,
          margin: "2px",
          border: isSelected(fieldConfig, option, value)
            ? `2px solid ${theme.palette.primary.main}`
            : undefined,
          borderRadius: "4px",
          flexDirection: "column",
        },
        ...fieldConfig.props,
      };
    };

    const containerProps = (
      fieldConfig: StandardImagePickerProps
    ): ImageListProps | undefined => fieldConfig.groupContainerProps;

    return (
      <Controller
        name={fieldConfig.attribute}
        control={control}
        defaultValue={getValues(fieldConfig.attribute) || 0}
        render={({ field }) => (
          <Fragment>
            {showTitle && titleProps.title && <Title {...titleProps} />}
            <ImageListRoot>
              <StyledImageList
                {...containerProps(fieldConfig)}
                cols={sanitizeImageCols(fieldConfig.imageCols)[widthType]}
                rowHeight="auto"
              >
                {fieldConfig.images?.map((image, index) => (
                  <ButtonBase
                    key={index}
                    {...componentProps(fieldConfig, image, field.value)}
                  >
                    <ImageContainerRoot>
                      <ImageContainerSizer fieldConfig={fieldConfig} />
                      <ImageContainer {...fieldConfig.imageProps}>
                        {image.customComponent ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            {image.customComponent}
                          </Box>
                        ) : (
                          <Image
                            src={image.src}
                            alt={image.alt || image.label}
                            title={image.label || image.alt}
                            loading="lazy"
                          />
                        )}
                      </ImageContainer>
                    </ImageContainerRoot>
                    {image.label && (
                      <LabelContainer fieldConfig={fieldConfig}>
                        <Label
                          fieldConfig={fieldConfig}
                          {...fieldConfig.labelProps}
                        >
                          {image.label}
                        </Label>
                      </LabelContainer>
                    )}
                    {image.subLabel && (
                      <SubLabelContainer fieldConfig={fieldConfig}>
                        <SubLabel
                          fieldConfig={fieldConfig}
                          {...fieldConfig.subLabelProps}
                        >
                          {image.subLabel}
                        </SubLabel>
                      </SubLabelContainer>
                    )}
                  </ButtonBase>
                ))}
              </StyledImageList>
            </ImageListRoot>
            {errors?.length > 0 && <ErrorText error={errors[0]} />}
          </Fragment>
        )}
      />
    );
  }
);

export { StandardImagePicker };
