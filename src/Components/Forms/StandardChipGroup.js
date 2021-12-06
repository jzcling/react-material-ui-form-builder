import React, { forwardRef, useMemo } from "react";
import { Chip, FormControl, FormGroup } from "@mui/material";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Fragment } from "react";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";
import { getValidationType, shuffleArray } from "../Utils/helpers";
import ErrorText from "../Widgets/ErrorText";
import CustomChip from "../Widgets/CustomChip";

const StandardChipGroup = forwardRef((props, ref) => {
  const { field, value, updateForm, showTitle } = props;
  const { errors, validate } = useValidation(
    getValidationType(field),
    field.validations
  );

  const optionConfig = useMemo(
    () => (option) => {
      const config = {
        key: option,
        value: option,
        label: option,
        subLabel: null,
      };

      if (!field.optionConfig) {
        return config;
      }

      config.key = field.optionConfig.key
        ? get(option, field.optionConfig.key)
        : config.key;
      config.value = field.optionConfig.value
        ? get(option, field.optionConfig.value)
        : config.value;
      config.label = field.optionConfig.label
        ? String(get(option, field.optionConfig.label))
        : config.label;
      config.subLabel = field.optionConfig.subLabel
        ? String(get(option, field.optionConfig.subLabel))
        : config.subLabel;

      return config;
    },
    [field]
  );

  const handleChipClick = (option) => {
    if (field.multiple) {
      const index = (value || []).findIndex(
        (value) => value === optionConfig(option).value
      );
      if (index >= 0) {
        var copy = [...value];
        copy.splice(index, 1);
        if (copy.length === 0) {
          copy = null;
        }
        updateForm({ [field.attribute]: copy });
        return;
      }
      updateForm({
        [field.attribute]: [...(value || []), optionConfig(option).value],
      });
    } else {
      if (value === optionConfig(option).value) {
        updateForm({ [field.attribute]: undefined });
        return;
      }
      updateForm({ [field.attribute]: optionConfig(option).value });
    }
  };

  const componentProps = (field, option) => {
    var isSelected;
    if (field.multiple) {
      isSelected = value && value.includes(optionConfig(option).value);
    } else {
      isSelected = value === optionConfig(option).value;
    }
    var props;
    if (field.customChip) {
      props = {
        id: field.id || field.attribute,
        key: optionConfig(option).key,
        label: optionConfig(option).label,
        subLabel: optionConfig(option).subLabel,
        active: isSelected,
        ...field.props,
        labelProps: field.labelProps,
        subLabelProps: field.subLabelProps,
        sx: {
          height: "auto",
          margin: "4px 8px 4px 0",
          ...(field.props?.sx || field.props?.style),
        },
        onClick: field.props?.onClick
          ? field.props.onClick(option)
          : () => handleChipClick(option),
      };
    } else {
      props = {
        id: field.id || field.attribute,
        key: optionConfig(option).key,
        label: optionConfig(option).label,
        color: isSelected ? "primary" : "default",
        variant: isSelected ? "default" : "outlined",
        ...field.props,
        sx: {
          height: "auto",
          margin: "4px 8px 4px 0",
          ...(field.props?.sx || field.props?.style),
          "& .MuiChip-label": {
            padding: "8px",
            ...(field.labelProps?.sx || field.labelProps?.style),
          },
        },
        onClick: field.props?.onClick
          ? field.props.onClick(option)
          : () => handleChipClick(option),
      };
    }
    return props;
  };

  const containerProps = (field) => {
    return {
      error: errors?.length > 0,
      onBlur: () => validate(value),
      ...field.groupContainerProps,
      sx: { flexWrap: "wrap", ...(field.groupContainerProps || {}).style },
    };
  };

  const options = useMemo(() => {
    if (field.randomizeOptions) {
      return shuffleArray(field.options || []);
    }
    return field.options || [];
  }, [field.options]);

  return (
    <Fragment>
      {showTitle && field.title && <Title field={field} />}
      <FormGroup component="fieldset">
        <FormControl {...containerProps(field)}>
          {options.map((option, index) => (
            <div
              ref={(el) => {
                if (el && ref) {
                  el.validate = (value) => validate(value);
                  ref(el);
                }
              }}
              key={field.id + "-" + index}
            >
              {field.customChip ? (
                <CustomChip {...componentProps(field, option)} />
              ) : (
                <Chip {...componentProps(field, option)} />
              )}
            </div>
          ))}
        </FormControl>
        {errors?.length > 0 && <ErrorText error={errors[0]} />}
      </FormGroup>
    </Fragment>
  );
});

StandardChipGroup.displayName = "StandardChipGroup";

StandardChipGroup.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardChipGroup.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardChipGroup };
