import { ButtonBase, ImageList, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import useValidation from "../../Hooks/useValidation";
import { get } from "lodash-es";
import Title from "../Widgets/Title";

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
    padding: "0 !important",
    borderRadius: "4px",
  },
  imgContainerSizer: {
    marginTop: (aspectRatio) => `${(aspectRatio[1] / aspectRatio[0]) * 100}%`,
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
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
  errorText: {
    marginTop: "4px",
    fontSize: "0.75rem",
    color: theme.palette.error.main,
  },
}));

const StandardImagePicker = forwardRef((props, ref) => {
  const { field, form, updateForm } = props;
  const classes = useStyles(field.aspectRatio || [1, 1]);
  const { errors, validate } = useValidation("date", field, form, updateForm);
  const theme = useTheme();

  const handleClick = (option) => {
    if (field.multiple) {
      const index = (get(form, field.attribute) || []).findIndex(
        (value) => value === option.src
      );
      if (index >= 0) {
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
        option.src,
      ]);
    } else {
      if (get(form, field.attribute) === option.src) {
        updateForm(field.attribute, undefined);
        return;
      }
      updateForm(field.attribute, option.src);
    }
  };

  const isSelected = (field, option) => {
    var isSelected;
    if (field.multiple) {
      isSelected =
        get(form, field.attribute) &&
        get(form, field.attribute).includes(option.src);
    } else {
      isSelected = get(form, field.attribute) === option.src;
    }
    return isSelected;
  };

  const componentProps = (field, option) => {
    return {
      id: field.id || field.attribute,
      component: "div",
      className: classes.imgContainerRoot,
      style: {
        width: `calc(${100 / (field.imageCols || 2)}% - 4px)`,
        border: isSelected(field, option)
          ? `2px solid ${theme.palette.primary.main}`
          : null,
      },
      onClick: () => handleClick(option),
      ...field.props,
    };
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
          el.blur = () => validate(get(form, field.attribute));
          ref(el);
        }
      }}
    >
      {field.title && <Title field={field} />}
      <div className={classes.gridListRoot}>
        <ImageList
          className={classes.gridList}
          {...containerProps(field)}
          rowHeight="auto"
        >
          {field.images?.map((image, index) => (
            <ButtonBase key={index} {...componentProps(field, image)}>
              <div className={classes.imgContainerSizer} />
              <div className={classes.imgContainer}>
                <img
                  src={image.src}
                  alt={image.alt}
                  title={image.alt}
                  loading="lazy"
                  className={classes.image}
                  style={isSelected(field, image) ? { padding: "2px" } : null}
                />
              </div>
            </ButtonBase>
          ))}
        </ImageList>
      </div>
      {errors.length > 0 && (
        <Typography className={classes.errorText}>{errors[0]}</Typography>
      )}
    </div>
  );
});

StandardImagePicker.displayName = "StandardImagePicker";

StandardImagePicker.defaultProps = {
  updateForm: () => {},
};

StandardImagePicker.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardImagePicker;
