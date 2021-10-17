import React, { forwardRef, Fragment, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { ButtonBase, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";

const fileTypes = [
  ".pdf",
  ".doc",
  ".docx",
  ".xml",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls",
  ".xlsx",
  ".csv",
  "image/*",
  "audio/*",
  "video/*",
];

function isString(str) {
  if (str && typeof str.valueOf() === "string") {
    return true;
  }
  return false;
}

const flattenDeep = (arr) =>
  arr.flatMap((subArray) =>
    Array.isArray(subArray) ? flattenDeep(subArray) : subArray
  );

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    textAlign: "center",
  },
  imageContainerRoot: {
    display: "inline-block",
    position: "relative",
    width: "100%",
  },
  imageSizer: ({ aspectRatio, imageSize }) => ({
    marginTop: `${
      ((imageSize[1] || aspectRatio[1] || 1) /
        (imageSize[0] || aspectRatio[0] || 1)) *
      100
    }%`,
  }),
  imageContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  input: {
    textAlign: "start",
    border: ({ errors }) =>
      `1px solid ${errors?.length > 0 ? theme.palette.error.main : "#b9b9b9"}`,
    borderRadius: "4px",
    padding: "7px 10px",
    color: "rgba(0, 0, 0, 0.87)",
    overflow: "hidden",
    whiteSpace: "nowrap",
    margin: theme.spacing(1, 0),
  },
  buttonBase: {
    width: "100%",
    display: "block",
  },
  errorText: {
    fontSize: "0.75rem",
    color: theme.palette.error.main,
  },
}));

const StandardFileUpload = forwardRef((props, ref) => {
  const { field, value, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("mixed", field);
  const classes = useStyles({
    errors: errors,
    aspectRatio: field.aspectRatio || [],
    imageSize: field.imageSize || [],
  });

  const [fileErrors, setFileErrors] = useState([]);

  const maxSizeMb = useMemo(() => {
    return field.maxSizeMb || 2;
  }, [field.maxSizeMb]);

  const acceptTypes = useMemo(() => {
    if (isString(field.acceptTypes)) {
      return field.acceptTypes;
    }
    if (Array.isArray(field.acceptTypes)) {
      return flattenDeep(field.acceptTypes).join(" ");
    }
    return fileTypes.join(" ");
  }, [field.acceptTypes]);

  const attachFiles = (files) => {
    if (files.length < 1) {
      setFileErrors(["Nothing selected"]);
      return;
    }

    var input = {
      files: [],
      imageUrls: [],
    };
    var errors = [];
    for (const file of files) {
      if (file.size > maxSizeMb * 1024 * 1024) {
        errors.push(
          (file.name || "File") + " should be less than " + maxSizeMb + " MB"
        );
        continue;
      }
      input.files.push(file);

      if (field.fileType === "image") {
        const url = URL.createObjectURL(file);
        input.imageUrls.push(url);
      }
    }

    // If not multiple, there should be only 1 file
    if (!(field.props || {}).multiple) {
      input = {
        files: [input.files[0]],
        imageUrls: [input.imageUrls[0]],
      };
    }

    updateForm({
      [field.attribute]: input,
    });
    setFileErrors(errors);
  };

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      type: "file",
      hidden: true,
      multiple: false,
      accept: acceptTypes,
      onChange: (event) => attachFiles(event.target.files),
      ...field.props,
    };
  };

  return (
    <Fragment>
      {showTitle && field.title && <Title field={field} />}
      <input
        ref={(el) => {
          if (el && ref) {
            el.validate = (value) => validate(value);
            ref(el);
          }
        }}
        {...componentProps(field)}
      />
      <label htmlFor={componentProps(field).id} onBlur={() => validate(value)}>
        {value?.files?.length > 0 ? (
          <ButtonBase className={classes.buttonBase} component="div">
            {value.files.map((file, index) => (
              <div className={classes.inputRoot} key={index}>
                {field.fileType === "image" && value.imageUrls?.length > 0 && (
                  <div
                    className={classes.imageContainerRoot}
                    style={{
                      width: (field.imageSize || [])[0],
                      height: (field.imageSize || [])[1],
                    }}
                  >
                    <div className={classes.imageSizer} />
                    <div className={classes.imageContainer}>
                      <img
                        src={value.imageUrls?.[index]}
                        alt={file.name}
                        loading="lazy"
                        className={classes.image}
                      />
                    </div>
                  </div>
                )}
                <Typography className={classes.input}>
                  {file.name || file}
                </Typography>
              </div>
            ))}
          </ButtonBase>
        ) : (
          <ButtonBase className={classes.buttonBase} component="div">
            <div className={classes.inputRoot}>
              {field.fileType === "image" && field.imageUrls?.[0] && (
                <div
                  className={classes.imageContainerRoot}
                  style={{
                    width: (field.imageSize || [])[0],
                    height: (field.imageSize || [])[1],
                  }}
                >
                  <div className={classes.imageSizer} />
                  <div className={classes.imageContainer}>
                    <img
                      src={field.imageUrls[0]}
                      alt={field.label}
                      loading="lazy"
                      className={classes.image}
                    />
                  </div>
                </div>
              )}
              <Typography
                style={{ color: "#777777" }}
                className={classes.input}
              >
                {field.imageUrls?.[0] || field.label}
              </Typography>
            </div>
          </ButtonBase>
        )}
        {errors?.length > 0 && (
          <Typography className={classes.errorText}>{errors[0]}</Typography>
        )}
        {fileErrors?.length > 0 && (
          <Typography className={classes.errorText}>{fileErrors[0]}</Typography>
        )}
      </label>
    </Fragment>
  );
});

StandardFileUpload.displayName = "StandardFileUpload";

StandardFileUpload.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardFileUpload.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.any,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardFileUpload };
