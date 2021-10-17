import React, { forwardRef } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Star, StarBorder } from "@material-ui/icons";
import PropTypes from "prop-types";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";
import { Rating } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  errorText: {
    marginTop: "4px",
    fontSize: "0.75rem",
    color: theme.palette.error.main,
  },
  iconColor: (field) => ({
    color: field.iconColor,
  }),
}));

const StandardRating = forwardRef((props, ref) => {
  const { field, value, updateForm, showTitle } = props;
  const classes = useStyles(field);
  const { errors, validate } = useValidation("number", field);

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      name: field.id || field.attribute,
      value: value || 0,
      precision: 0.5,
      icon: <Star style={{ margin: "0 8px", fontSize: "32px" }} />,
      emptyIcon: <StarBorder style={{ margin: "0 8px", fontSize: "32px" }} />,
      onChange: (event, value) => updateForm({ [field.attribute]: value }),
      classes: {
        iconFilled: classes.iconColor,
      },
      ...field.props,
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
      <Rating ref={ref} {...componentProps(field)} />
      {errors?.length > 0 && (
        <Typography className={classes.errorText}>{errors[0]}</Typography>
      )}
    </div>
  );
});

StandardRating.displayName = "StandardRating";

StandardRating.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardRating.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.number,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardRating };
