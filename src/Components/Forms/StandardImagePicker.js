import { ButtonBase, ImageList, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import React, { forwardRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";
import { useDimensions } from "../../Hooks/useDimensions";
import { getValidationType } from "../Utils/helpers";
import ErrorText from "../Widgets/ErrorText";

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

const ImageContainerSizer = styled("div")(({ field }) => ({
  marginTop: `${(field.aspectRatio[1] / field.aspectRatio[0]) * 100}%`,
}));

const ImageContainer = styled("div")(() => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}));

const Image = styled("img")(() => ({
  borderRadius: "4px",
  objectFit: "contain",
  width: "100%",
  height: "100%",
  pointerEvents: "none",
}));

const LabelContainer = styled("div")(({ field }) => ({
  margin: "4px",
  overflow: "hidden",
  height: field.labelLines * (getLabelFontSize(field) + 2),
}));

const Label = styled(Typography)(({ field }) => ({
  display: "-webkit-box",
  boxOrient: "vertical",
  lineClamp: field.labelLines,
  lineHeight: `${getLabelFontSize(field) + 2}px`,
  textAlign: "center",
}));

const SubLabelContainer = styled("div")(({ field }) => ({
  margin: "4px",
  overflow: "hidden",
  height: field.subLabelLines * (getSubLabelFontSize(field) + 2),
}));

const SubLabel = styled(Typography)(({ field }) => ({
  display: "-webkit-box",
  boxOrient: "vertical",
  lineClamp: field.subLabelLines,
  lineHeight: `${getSubLabelFontSize(field) + 2}px`,
  textAlign: "center",
}));

const getLabelFontSize = (field) =>
  ((field.labelProps || {}).style || {}).fontSize
    ? Number(
        String(((field.labelProps || {}).style || {}).fontSize).replace(
          "px",
          ""
        )
      )
    : 14;

const getSubLabelFontSize = (field) =>
  ((field.subLabelProps || {}).style || {}).fontSize
    ? Number(
        String(((field.subLabelProps || {}).style || {}).fontSize).replace(
          "px",
          ""
        )
      )
    : 14;

function sanitizeImageCols(col) {
  const copy = { ...(col || {}) };
  copy.xs = col.xs || 2;
  copy.sm = col.sm || copy.xs;
  copy.md = col.md || copy.sm;
  copy.lg = col.lg || copy.md;
  copy.xl = col.xl || copy.lg;
  return copy;
}

const StandardImagePicker = forwardRef((props, ref) => {
  const { field, value, updateForm, showTitle } = props;
  const { errors, validate } = useValidation(
    getValidationType(field),
    field.validations
  );
  const theme = useTheme();
  const { widthType } = useDimensions();

  useEffect(() => {
    console.log(widthType);
    console.log(sanitizeImageCols(field.imageCols));
    console.log(sanitizeImageCols(field.imageCols)[widthType]);
  }, [widthType]);

  const getValueKey = useMemo(() => {
    if (field.getValueKey) {
      return field.getValueKey;
    }
    return (value) => value?.label || value?.src;
  }, [field.getValueKey]);

  const getOptionKey = useMemo(() => {
    if (field.getOptionKey) {
      return field.getOptionKey;
    }
    return (option) => option?.label || option?.src;
  }, [field.getOptionKey]);

  const handleClick = (option) => {
    if (field.multiple) {
      const index = (value || []).findIndex(
        (value) => getValueKey(value) === getOptionKey(option)
      );
      if (index >= 0) {
        // option is currently selected, so remove it
        var copy = [...value];
        copy.splice(index, 1);
        if (copy.length === 0) {
          copy = null;
        }
        updateForm({ [field.attribute]: copy });
        return;
      }
      updateForm({
        [field.attribute]: [...(value || []), option],
      });
    } else {
      if (getValueKey(value) === getOptionKey(option)) {
        // option currently selected, so remove it
        updateForm({ [field.attribute]: undefined });
        return;
      }
      updateForm({ [field.attribute]: option });
    }
  };

  const isSelected = (field, option) => {
    var isSelected;
    if (field.multiple) {
      isSelected =
        (value || []).findIndex(
          (value) => getValueKey(value) === getOptionKey(option)
        ) >= 0;
    } else {
      isSelected = getValueKey(value) === getOptionKey(option);
    }
    return isSelected;
  };

  const componentProps = (field, option) => {
    var props = {
      id: field.id || field.attribute,
      component: "div",
      style: {
        width: `calc(100% - ${isSelected(field, option) ? "12px" : "8px"})`,
        margin: "2px",
        border: isSelected(field, option)
          ? `2px solid ${theme.palette.primary.main}`
          : null,
        borderRadius: "4px",
        flexDirection: "column",
      },
      ...field.props,
      onClick: field.props?.onClick
        ? field.props.onClick(option)
        : () => handleClick(option),
      onMouseEnter: field.props?.onMouseEnter
        ? field.props.onMouseEnter(option)
        : undefined,
      onMouseLeave: field.props?.onMouseLeave
        ? field.props.onMouseLeave(option)
        : undefined,
    };
    return props;
  };

  const containerProps = (field) => {
    return {
      ...field.groupContainerProps,
    };
  };

  return (
    <div
      ref={(el) => {
        if (el && ref) {
          el.validate = (value) => validate(value);
          ref(el);
        }
      }}
    >
      {showTitle && field.title && <Title field={field} />}
      <ImageListRoot>
        <StyledImageList
          {...containerProps(field)}
          cols={sanitizeImageCols(field.imageCols)[widthType]}
          rowHeight="auto"
        >
          {(field.images || []).map((image, index) => (
            <ButtonBase key={index} {...componentProps(field, image)}>
              <ImageContainerRoot>
                <ImageContainerSizer field={field} />
                <ImageContainer>
                  {image.customComponent ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {image.customComponent}
                    </div>
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
                <LabelContainer field={field}>
                  <Label field={field} {...field.labelProps}>
                    {image.label}
                  </Label>
                </LabelContainer>
              )}
              {image.subLabel && (
                <SubLabelContainer field={field}>
                  <SubLabel field={field} {...field.subLabelProps}>
                    {image.subLabel}
                  </SubLabel>
                </SubLabelContainer>
              )}
            </ButtonBase>
          ))}
        </StyledImageList>
      </ImageListRoot>
      {errors?.length > 0 && <ErrorText error={errors[0]} />}
    </div>
  );
});

StandardImagePicker.displayName = "StandardImagePicker";

StandardImagePicker.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardImagePicker.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.any,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardImagePicker };
