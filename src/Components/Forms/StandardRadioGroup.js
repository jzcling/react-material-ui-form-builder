import React, { useMemo } from "react";
import {
  Radio,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import _ from "lodash";
import { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
  groupContainer: {
    margin: theme.spacing(1),
  },
}));

function StandardRadioGroup(props) {
  const { field, form, updateForm } = props;
  const classes = useStyles();

  const optionConfig = useMemo(
    () => (option) => {
      const config = {
        key: option,
        value: option,
        label: option,
      };

      if (!field.optionConfig) {
        return config;
      }

      config.key = field.optionConfig.key
        ? _.get(option, field.optionConfig.key)
        : config.key;
      config.value = field.optionConfig.value
        ? _.get(option, field.optionConfig.value)
        : config.value;
      config.label = field.optionConfig.label
        ? String(_.get(option, field.optionConfig.label))
        : config.label;

      return config;
    },
    [field]
  );

  const handleRadioChange = (value, checked) => {
    if (checked) {
      updateForm(field.attribute, value);
    }
  };

  const componentProps = (field, option) => {
    var isSelected;
    if (field.multiple) {
      isSelected =
        _.get(form, field.attribute) &&
        _.get(form, field.attribute).includes(optionConfig(option).value);
    } else {
      isSelected = _.get(form, field.attribute) === optionConfig(option).value;
    }
    return {
      id: field.id || field.attribute,
      key: optionConfig(option).key,
      color: "primary",
      checked: isSelected,
      value: optionConfig(option).value,
      onChange: (event) =>
        handleRadioChange(event.target.value, event.target.checked),
      ...field.props,
    };
  };

  const containerProps = (field) => {
    return {
      className: classes.groupContainer,
      component: "fieldset",
      ...field.groupContainerProps,
    };
  };

  return (
    <Fragment>
      {field.title && (
        <Typography {...field.titleProps}>{field.title}</Typography>
      )}
      <FormGroup {...containerProps(field)}>
        {(field.options || []).map((option, index) => (
          <FormControlLabel
            key={field.id + "-" + index}
            control={<Radio {...componentProps(field, option)} />}
            label={optionConfig(option).label}
            {...field.labelProps}
          />
        ))}
      </FormGroup>
    </Fragment>
  );
}

StandardRadioGroup.defaultProps = {
  updateForm: () => {},
};

StandardRadioGroup.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardRadioGroup;
