import React, { Fragment, useMemo } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { ButtonBase, makeStyles, Typography } from "@material-ui/core";
import _ from "lodash";

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

const useStyles = makeStyles((theme) => ({
  input: {
    justifyContent: "start",
    border: "1px solid #b9b9b9",
    borderRadius: "4px",
    width: "100%",
    padding: "7px 10px",
    color: "rgba(0, 0, 0, 0.87)",
    overflow: "hidden",
    whiteSpace: "nowrap",
    margin: theme.spacing(1, 0),
  },
  buttonBase: {
    textAlign: "start",
    width: "100%",
    display: "block",
  },
}));

export default function StandardFileUpload(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { field, form, updateForm } = props;

  const files = useMemo(() => {
    return _.get(form, field.attribute) || [];
  }, [form, field.attribute]);

  const maxSizeMb = useMemo(() => {
    return field.maxSizeMb || 2;
  }, [field.maxSizeMb]);

  const acceptTypes = useMemo(() => {
    if (_.isString(field.acceptTypes)) {
      return field.acceptTypes;
    }
    if (_.isArray(field.acceptTypes)) {
      return _.concat(field.acceptTypes);
    }
    return _.concat(fileTypes);
  }, [field.acceptTypes]);

  const attachFiles = (files) => {
    if (files.length < 1) {
      enqueueSnackbar("Nothing selected", { variant: "error" });
      return;
    }

    var input = [];
    for (const file of files) {
      if (file.size > maxSizeMb * 1024 * 1024) {
        enqueueSnackbar("File should be less than " + maxSizeMb + " MB", {
          variant: "error",
        });
        continue;
      }
      input.push(file);
    }

    updateForm(field.attribute, input);
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
      {field.title && (
        <Typography {...field.titleProps}>{field.title}</Typography>
      )}
      <input {...componentProps(field)} />
      <label htmlFor={componentProps(field).id}>
        {files.length > 0 ? (
          <ButtonBase className={classes.buttonBase} component="div">
            {files.map((file, index) => (
              <Typography key={index} className={classes.input}>
                {file.name}
              </Typography>
            ))}
          </ButtonBase>
        ) : (
          <ButtonBase className={classes.input} component="div">
            <Typography style={{ color: "#777777" }}>{field.label}</Typography>
          </ButtonBase>
        )}
      </label>
    </Fragment>
  );
}

StandardFileUpload.defaultProps = {
  updateForm: () => {},
};

StandardFileUpload.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};
