import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import { Title } from "../Widgets/Title";
import get from "lodash/get";
import { useValidation } from "../../Hooks/useValidation";

const useStyles = makeStyles((theme) => ({
  counterAddButton: {
    color: theme.palette.primary.main,
  },
  counterReduceButton: {
    color: theme.palette.primary.light,
  },
  counter: {
    border: "1px solid #b9b9b9",
    borderRadius: "4px",
    textAlign: "center",
    width: "60px",
    padding: "4px",
    color: "rgba(0, 0, 0, 0.87)",
  },
  errorText: {
    marginTop: "4px",
    fontSize: "0.75rem",
    color: theme.palette.error.main,
  },
  flex: {
    display: "flex",
    alignItems: "center",
  },
}));

const StandardCounter = forwardRef((props, ref) => {
  const classes = useStyles();
  const { field, form, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("number", field);

  return (
    <div
      ref={(el) => {
        if (el && ref) {
          el.validate = (value) => validate(value);
          ref(el);
        }
      }}
      className={classes.flex}
    >
      {showTitle && field.title && <Title field={field} form={form} />}
      <Tooltip title="Reduce">
        <span>
          <IconButton
            aria-label="reduce"
            className={classes.counterReduceButton}
            onClick={() =>
              updateForm({
                [field.attribute]: Number(get(form, field.attribute) || 0) - 1,
              })
            }
            disabled={
              field.props?.disabled ||
              Number(get(form, field.attribute) || 0) <= Number(field.inputMin)
            }
          >
            <Remove />
          </IconButton>
        </span>
      </Tooltip>
      <div className={classes.counter} {...field.props}>
        <Typography style={{ fontSize: field.fontSize }}>
          {Number(get(form, field.attribute) || 0)}
        </Typography>
      </div>
      <Tooltip title="Add">
        <span>
          <IconButton
            aria-label="add"
            className={classes.counterAddButton}
            onClick={() =>
              updateForm({
                [field.attribute]: Number(get(form, field.attribute) || 0) + 1,
              })
            }
            disabled={
              field.props?.disabled ||
              Number(get(form, field.attribute) || 0) >= Number(field.inputMax)
            }
          >
            <Add />
          </IconButton>
        </span>
      </Tooltip>

      {errors?.length > 0 && (
        <Typography className={classes.errorText}>{errors[0]}</Typography>
      )}
    </div>
  );
});

StandardCounter.displayName = "StandardCounter";

StandardCounter.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardCounter.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardCounter };
