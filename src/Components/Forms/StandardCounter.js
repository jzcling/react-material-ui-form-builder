import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { Title } from "../Widgets/Title";
import { useValidation } from "../../Hooks/useValidation";
import ErrorText from "../Widgets/ErrorText";

const StandardCounter = forwardRef((props, ref) => {
  const theme = useTheme();
  const { field, value, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("number", field.validations);

  return (
    <div
      ref={(el) => {
        if (el && ref) {
          el.validate = (value) => validate(value);
          ref(el);
        }
      }}
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {showTitle && field.title && <Title field={field} />}
      <Tooltip title="Reduce">
        <span>
          <IconButton
            aria-label="reduce"
            sx={{
              color: theme.palette.primary.light,
            }}
            onClick={() =>
              updateForm({
                [field.attribute]: Number(value || 0) - 1,
              })
            }
            disabled={
              field.props?.disabled ||
              Number(value || 0) <= Number(field.inputMin || 0)
            }
            size="large"
          >
            <Remove />
          </IconButton>
        </span>
      </Tooltip>
      <div
        style={{
          border: "1px solid #b9b9b9",
          borderRadius: "4px",
          textAlign: "center",
          width: "60px",
          padding: "4px",
          color: "rgba(0, 0, 0, 0.87)",
        }}
        {...field.props}
      >
        <Typography style={{ fontSize: field.fontSize }}>
          {Number(value || 0)}
        </Typography>
      </div>
      <Tooltip title="Add">
        <span>
          <IconButton
            aria-label="add"
            sx={{
              color: theme.palette.primary.main,
            }}
            onClick={() => {
              updateForm({
                [field.attribute]: Number(value || 0) + 1,
              });
            }}
            disabled={
              field.props?.disabled ||
              Number(value || 0) >= Number(field.inputMax || 1000000)
            }
            size="large"
          >
            <Add />
          </IconButton>
        </span>
      </Tooltip>

      {errors?.length > 0 && <ErrorText error={errors[0]} />}
    </div>
  );
});

StandardCounter.displayName = "StandardCounter";

StandardCounter.defaultProps = {
  updateForm: () => {},
  value: 1,
  showTitle: true,
};

StandardCounter.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.number,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardCounter };
