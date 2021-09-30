import React from "react";
import * as yup from "yup";

function useValidation(type, field, validations = null) {
  const [errors, setErrors] = React.useState([]);

  if (!validations) {
    validations = getValidations(field);
  }
  var schema = yup[type]().nullable();
  for (var [key, value] of Object.entries(validations)) {
    if (value === true) {
      schema = schema[key]();
    } else {
      if (value !== null && value !== undefined) {
        if (key === "matches") {
          schema = handleMatches(key, value, schema);
        } else {
          if (Array.isArray(value) && !["oneOf", "notOneOf"].includes(key)) {
            schema = schema[key](...value);
          } else {
            schema = schema[key](value);
          }
        }
      }
    }
  }

  async function validate(value) {
    try {
      await schema.validate(value);
      setErrors([]);
    } catch (error) {
      setErrors(error.errors);
      return error.errors;
    }
    return [];
  }

  return { errors: errors, validate: validate };
}

function handleMatches(key, value, schema) {
  var re, message;
  if (Array.isArray(value)) {
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

export { useValidation };
