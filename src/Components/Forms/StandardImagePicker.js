import { ButtonBase, ImageList, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import React, { forwardRef, useMemo } from "react";
import PropTypes from "prop-types";
import { useValidation } from "../../Hooks/useValidation";
import get from "lodash/get";
import { Title } from "../Widgets/Title";
import { useDimensions } from "../../Hooks/useDimensions";
import { getValidationType } from "../Utils/helpers";

const useStyles = makeStyles((theme) => ({
  gridListRoot: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    cursor: "pointer",
  },
  gridList: {
    width: "100%",
    marginBottom: `2px !important`,
    // Promote into its own layer. Maintains high FPS at a memory cost
    transform: "translateZ(0)",
  },
  imgContainerRoot: {
    display: "inline-block",
    position: "relative",
    margin: "2px",
    width: "100%",
  },
  imgContainerSizer: {
    marginTop: ({ aspectRatio }) =>
      `${(aspectRatio[1] / aspectRatio[0]) * 100}%`,
  },
  imgContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  image: {
    borderRadius: "4px",
    objectFit: "contain",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  errorText: {
    marginTop: "4px",
    fontSize: "0.75rem",
    color: theme.palette.error.main,
  },
  labelContainer: {
    margin: "4px",
    overflow: "hidden",
    height: ({ labelLines, labelFontSize }) => labelLines * (labelFontSize + 2),
  },
  label: {
    display: "-webkit-box",
    boxOrient: "vertical",
    lineClamp: ({ labelLines }) => labelLines,
    lineHeight: ({ labelFontSize }) => `${labelFontSize + 2}px`,
    textAlign: "center",
  },
  subLabelContainer: {
    margin: "4px",
    overflow: "hidden",
    height: ({ subLabelLines, subLabelFontSize }) =>
      subLabelLines * (subLabelFontSize + 2),
  },
  subLabel: {
    display: "-webkit-box",
    boxOrient: "vertical",
    lineClamp: ({ subLabelLines }) => subLabelLines,
    lineHeight: ({ subLabelFontSize }) => `${subLabelFontSize + 2}px`,
    textAlign: "center",
  },
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
  col = col || {};
  col.xs = col.xs || 2;
  col.sm = col.sm || col.xs;
  col.md = col.md || col.sm;
  col.lg = col.lg || col.md;
  col.xl = col.xl || col.lg;
  return col;
}

const StandardImagePicker = forwardRef((props, ref) => {
  const { field, form, updateForm, showTitle } = props;
  const classes = useStyles({
    aspectRatio: field.aspectRatio || [1, 1],
    labelLines: field.labelLines || 2,
    labelFontSize: getLabelFontSize(field),
    subLabelLines: field.subLabelLines || 2,
    subLabelFontSize: getSubLabelFontSize(field),
  });
  const { errors, validate } = useValidation(
    getValidationType(field),
    field,
    form,
    updateForm
  );
  const theme = useTheme();
  const { widthType } = useDimensions();

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
      const index = (get(form, field.attribute) || []).findIndex(
        (value) => getValueKey(value) === getOptionKey(option)
      );
      if (index >= 0) {
        // option is currently selected, so remove it
        var copy = [...get(form, field.attribute)];
        copy.splice(index, 1);
        if (copy.length === 0) {
          copy = null;
        }
        updateForm(field.attribute, copy);
        return;
      }
      updateForm(field.attribute, [
        ...(get(form, field.attribute) || []),
        option,
      ]);
    } else {
      if (getValueKey(get(form, field.attribute)) === getOptionKey(option)) {
        // option currently selected, so remove it
        updateForm(field.attribute, undefined);
        return;
      }
      updateForm(field.attribute, option);
    }
  };

  const isSelected = (field, option) => {
    var isSelected;
    if (field.multiple) {
      isSelected =
        (get(form, field.attribute) || []).findIndex(
          (value) => getValueKey(value) === getOptionKey(option)
        ) > 0;
    } else {
      isSelected =
        getValueKey(get(form, field.attribute)) === getOptionKey(option);
    }
    return isSelected;
  };

  const componentProps = (field, option) => {
    var props = {
      id: field.id || field.attribute,
      component: "div",
      style: {
        width: `calc(${
          100 / sanitizeImageCols(field.imageCols)[widthType]
        }% - 4px)`,
        margin: "2px",
        border: isSelected(field, option)
          ? `2px solid ${theme.palette.primary.main}`
          : null,
        borderRadius: "4px",
        flexDirection: "column",
      },
      onClick: () => handleClick(option),
    };
    if (field.props) {
      props = {
        ...props,
        ...field.props(option),
      };
    }
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
      {showTitle && field.title && <Title field={field} form={form} />}
      <div className={classes.gridListRoot}>
        <ImageList
          className={classes.gridList}
          {...containerProps(field)}
          rowHeight="auto"
        >
          {(field.images || []).map((image, index) => (
            <ButtonBase key={index} {...componentProps(field, image)}>
              <div className={classes.imgContainerRoot}>
                <div className={classes.imgContainerSizer} />
                <div className={classes.imgContainer}>
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
                    <img
                      src={image.src}
                      alt={image.alt || image.label}
                      title={image.label || image.alt}
                      loading="lazy"
                      className={classes.image}
                      style={
                        isSelected(field, image) ? { padding: "2px" } : null
                      }
                    />
                  )}
                </div>
              </div>
              {image.label && (
                <div className={classes.labelContainer}>
                  <Typography className={classes.label} {...field.labelProps}>
                    {image.label}
                  </Typography>
                </div>
              )}
              {image.subLabel && (
                <div className={classes.subLabelContainer}>
                  <Typography
                    className={classes.subLabel}
                    {...field.subLabelProps}
                  >
                    {image.subLabel}
                  </Typography>
                </div>
              )}
            </ButtonBase>
          ))}
        </ImageList>
      </div>
      {errors?.length > 0 && (
        <Typography className={classes.errorText}>{errors[0]}</Typography>
      )}
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
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardImagePicker };
