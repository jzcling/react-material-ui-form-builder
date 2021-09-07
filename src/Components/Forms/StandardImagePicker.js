import { ButtonBase, ImageList, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import useValidation from "../../Hooks/useValidation";
import { get } from "lodash-es";

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
  },
  imgContainerSizer: {
    marginTop: "100%",
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
  const classes = useStyles();
  const { field, form, updateForm } = props;
  const { errors, validate } = useValidation("date", field, form, updateForm);

  return (
    <div
      ref={(el) => {
        if (el && ref) {
          el.blur = () => validate(get(form, field.attribute));
          ref(el);
        }
      }}
      className={classes.gridListRoot}
    >
      <ImageList className={classes.gridList} {...field.props} rowHeight="auto">
        {field.images?.map((image, index) => (
          <ButtonBase
            key={index}
            component="div"
            className={classes.imgContainerRoot}
            style={{
              width: `calc(${100 / field.cols}% - 4px)`,
            }}
          >
            <div className={classes.imgContainerSizer} />
            <div className={classes.imgContainer}>
              <img
                src={image.src}
                alt={image.alt}
                title={image.alt}
                loading="lazy"
                className={classes.image}
              />
            </div>
          </ButtonBase>
        ))}
      </ImageList>
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
