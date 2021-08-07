import _ from "lodash";
import React from "react";
import * as yup from "yup";

export default function useValidation(type, validations) {
  const [errors, setErrors] = React.useState([]);

  var schema = yup[type]();
  for (var [key, value] of Object.entries(validations)) {
    if (value === true) {
      schema = schema[key]();
    } else {
      if (value !== null && value !== undefined) {
        if (key === "matches") {
          schema = handleMatches(value, schema);
        } else {
          if (_.isArray(value)) {
            schema = schema[key](...value);
          } else {
            schema = schema[key](value);
          }
        }
      }
    }
  }

  async function validate(value) {
    console.log(schema);
    try {
      await schema.validate(value);
      setErrors([]);
    } catch (error) {
      setErrors(error.errors);
    }
  }

  function handleMatches(value, schema) {
    var re, message;
    if (_.isArray(value)) {
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

  return { errors: errors, validate: validate };
}
