import React, { useMemo } from "react";
import {
  Chip,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import _ from "lodash";
import { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
  chip: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  groupContainer: {
    margin: theme.spacing(1),
    flexDirection: "row",
  },
}));

function StandardChipGroup(props) {
  const classes = useStyles();
  const { field, form, updateForm } = props;

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

  const handleChipClick = (option) => {
    if (field.multiple) {
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
      updateForm(field.attribute, [
        ...(_.get(form, field.attribute) || []),
        optionConfig(option).value,
      ]);
    } else {
      if (_.get(form, field.attribute) === optionConfig(option).value) {
        updateForm(field.attribute, undefined);
        return;
      }
      updateForm(field.attribute, optionConfig(option).value);
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
      className: classes.chip,
      key: optionConfig(option).key,
      size: "small",
      label: optionConfig(option).label,
      color: isSelected ? "primary" : "default",
      variant: isSelected ? "default" : "outlined",
      onClick: () => handleChipClick(option),
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
            control={<Chip key={field.id} {...componentProps(field, option)} />}
          />
        ))}
      </FormGroup>
    </Fragment>
  );
}

StandardChipGroup.defaultProps = {
  updateForm: () => {},
};

StandardChipGroup.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};

export default StandardChipGroup;
