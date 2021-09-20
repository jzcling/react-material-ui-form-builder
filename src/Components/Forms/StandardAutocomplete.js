import React, {
  forwardRef,
  Fragment,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Chip, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import isObject from "lodash/isObject";
import PropTypes from "prop-types";
import { useValidation } from "../../Hooks/useValidation";
import { Title } from "../Widgets/Title";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const useStyles = makeStyles(() => ({
  autocomplete: {
    "& .MuiFormControl-marginDense": {
      marginTop: 0,
    },
  },
}));

const reorderTags = (list, startIndex, endIndex) => {
  const result = cloneDeep(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const StandardAutocomplete = forwardRef((props, ref) => {
  const classes = useStyles();
  const { field, form, updateForm, showTitle } = props;
  const { errors, validate } = useValidation("mixed", field, form, updateForm);
  const [focused, setFocused] = useState(false);

  const optionConfig = useMemo(
    () => (option) => {
      const config = {
        value: option,
        label: option,
      };

      if (!field.optionConfig) {
        return config;
      }

      if (field.optionConfig.value) {
        // This is to account for the quirky behaviour of onChange returning an array
        if (field.props && field.props.multiple && Array.isArray(option)) {
          const value = [];
          for (const item of option) {
            if (isObject(item)) {
              value.push(get(item, field.optionConfig.value));
            } else {
              value.push(item);
            }
          }
          config.value = value;
        } else {
          config.value = get(option, field.optionConfig.value);
        }
      }

      if (field.optionConfig.label) {
        // This is to account for the quirky behaviour of onChange returning an array
        if (field.props && field.props.multiple && Array.isArray(option)) {
          const label = [];
          for (const item of option) {
            if (isObject(item)) {
              label.push(item);
            } else {
              label.push(get(item, field.optionConfig.label));
            }
          }
          config.label = label;
        } else {
          config.label = get(option, field.optionConfig.label);
        }
      }

      return config;
    },
    [field]
  );

  /* 
  Required to handle quirky behaviour of Autocomplete component
  where it returns the option object when opening the selection box
  and returns the option value upon selection 
  */
  function getLabel(option) {
    if (isObject(option)) {
      return String(optionConfig(option).label);
    }
    if ((field.optionConfig || {}).value) {
      const o =
        field.options.find((o) => optionConfig(o).value === option) || {};
      return String(optionConfig(o).label);
    }
    return String(option);
  }

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      size: "small",
      fullWidth: true,
      options: field.options,
      getOptionSelected: (option, value) => {
        /* 
        Required to handle the quirky behaviour of Autocomplete component
        where it returns the value object sometimes and value value sometimes
        */
        return isObject(value)
          ? optionConfig(option).value === optionConfig(value).value
          : optionConfig(option).value === value;
      },
      getOptionLabel: (option) => getLabel(option),
      renderInput: (params) => (
        <TextField
          {...params}
          inputRef={ref}
          variant="outlined"
          margin="dense"
          inputProps={{
            ...params.inputProps,
            autoComplete: "off", // disable autocomplete and autofill
          }}
          label={field.label}
          error={errors?.length > 0}
          helperText={errors[0]}
        />
      ),
      renderTags: (value, getTagProps) => {
        if (field.sortable && focused) {
          return (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="options">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {value.map((option, index) => (
                      <Draggable
                        key={index}
                        draggableId={String(index)}
                        index={index}
                        isDragDisabled={!(field.props && field.props.multiple)}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Chip
                              variant="outlined"
                              label={optionConfig(option).label}
                              style={{ cursor: "grab" }}
                              {...getTagProps({ index })}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          );
        } else {
          return value.map((option, index) => (
            <Chip
              key={index}
              variant="outlined"
              size="small"
              label={optionConfig(option).label}
              {...getTagProps({ index })}
            />
          ));
        }
      },
      value:
        get(form, field.attribute) ||
        (field.props && field.props.multiple ? [] : null),
      onChange: (event, option) => {
        updateForm(field.attribute, optionConfig(option).value);
      },
      onBlur: () => {
        setFocused(false);
        validate(get(form, field.attribute));
      },
      onFocus: () => setFocused(true),
      className: classes.autocomplete,
      ...field.props,
    };
  };

  const onDragEnd = useCallback((result) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const reordered = reorderTags(
      get(form, field.attribute) || [],
      result.source.index,
      result.destination.index
    );

    updateForm(field.attribute, reordered);
  }, []);

  return (
    <Fragment>
      {showTitle && field.title && <Title field={field} />}
      <Autocomplete {...componentProps(field)} />
    </Fragment>
  );
});

StandardAutocomplete.displayName = "StandardAutocomplete";

StandardAutocomplete.defaultProps = {
  updateForm: () => {},
  showTitle: true,
};

StandardAutocomplete.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
  showTitle: PropTypes.bool,
};

export { StandardAutocomplete };
