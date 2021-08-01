import React, { useMemo } from "react";
import {
  Checkbox,
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

function StandardCheckboxGroup(props) {
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

  const handleCheckboxChange = (option, value) => {
    if (field.multiple) {
      if (value) {
        updateForm(field.attribute, [
          ...(_.get(form, field.attribute) || []),
          optionConfig(option).value,
        ]);
      } else {
        const index = (_.get(form, field.attribute) || []).findIndex(
          (value) => value === optionConfig(option).value
        );
        if (index >= 0) {
          var copy = [..._.get(form, field.attribute)];
          copy.splice(index, 1);
          if (copy.length === 0) {
            copy = null;
          }
          updateForm(field.attribute, copy);
          return;
        }
      }
    } else {
      if (value) {
        updateForm(field.attribute, optionConfig(option).value);
      } else {
        updateForm(field.attribute, undefined);
      }
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
      onChange: (event) => handleCheckboxChange(option, event.target.checked),
      ...(field.props || {}),
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
      {field.label && (
        <Typography {...field.labelProps}>{field.label}</Typography>
      )}
      <FormGroup {...containerProps(field)}>
        {(field.options || []).map((option) => (
          <FormControlLabel
            key={field.id}
            control={<Checkbox {...componentProps(field, option)} />}
            label={optionConfig(option).label}
          />
        ))}
      </FormGroup>
    </Fragment>
  );
}

StandardCheckboxGroup.defaultProps = {
  updateForm: () => {},
};

StandardCheckboxGroup.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardCheckboxGroup;
