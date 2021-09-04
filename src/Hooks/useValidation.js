import isArray from "lodash/isArray";
import cloneDeep from "lodash/cloneDeep";
import set from "lodash/set";
import unset from "lodash/unset";
import React from "react";
import * as yup from "yup";

export default function useValidation(
  type,
  field,
  form,
  updateForm,
  validations = null
) {
  const [errors, setErrors] = React.useState([]);

  if (!validations) {
    validations = getValidations(field);
  }
  var schema = yup[type]();
  for (var [key, value] of Object.entries(validations)) {
    if (value === true) {
      schema = schema[key]();
    } else {
      if (value !== null && value !== undefined) {
        if (key === "matches") {
          schema = handleMatches(key, value, schema);
        } else {
          if (isArray(value) && !["oneOf", "notOneOf"].includes(key)) {
            schema = schema[key](...value);
          } else {
            schema = schema[key](value);
          }
        }
      }
    }
  }

  async function validate(value) {
    const formErrors = cloneDeep(form.errors || {});
    try {
      await schema.validate(value);
      setErrors([]);
      unset(formErrors, field.attribute);
      updateForm("errors", formErrors);
    } catch (error) {
      setErrors(error.errors);
      set(formErrors, field.attribute, error.errors);
      updateForm("errors", formErrors);
    }
  }

  return { errors: errors, validate: validate };
}

function handleMatches(key, value, schema) {
  var re, message;
  if (isArray(value)) {
    [re, message] = value;
  } else {
    re = value;
  }
  try {
    var flags = re.replace(/.*\/([gimy]*)$/, "$1");
    var pattern = re.replace(new RegExp("^/(.*?)/" + flags + "$"), "$1");
    var regex = new RegExp(pattern, flags);
    if (message) {
      schema = schema[key](regex, message);
    } else {
      schema = schema[key](regex);
    }
  } catch (error) {
    // console.log(error);
  }
  return schema;
}

function getValidations(field) {
  var validations = {};
  if (field.label) {
    validations.label = field.label;
  }
  validations = { ...validations, ...field.validations };
  return validations;
}
