import React, { forwardRef } from "react";
import { Star, StarBorder } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";
import { Rating } from "@mui/material";
import ErrorText from "../Widgets/ErrorText";

const StandardRating = forwardRef((props, ref) => {
  const { field, value, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("number", field.validations);

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      name: field.id || field.attribute,
      value: value || 0,
      precision: 0.5,
      icon: <Star style={{ margin: "0 8px", fontSize: "32px" }} />,
      emptyIcon: <StarBorder style={{ margin: "0 8px", fontSize: "32px" }} />,
      onChange: (event, value) => updateForm({ [field.attribute]: value }),
      sx: {
        "& .MuiRating-iconFilled": {
          color: field.iconColor,
        },
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
      {errors?.length > 0 && <ErrorText error={errors[0]} />}
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
