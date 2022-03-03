import React from "react";
import * as yup from "yup";

import { FieldProp } from "../components/FormBuilder";
import { Validation } from "../components/props/FieldProps";

function useValidation(fields: Array<FieldProp>): {
  schema: yup.AnyObjectSchema;
} {
  const formSchema: { [x: string]: yup.AnySchema } = {};
  for (const field of fields) {
    if (field.attribute) {
      const fieldSchema = getFieldSchema(
        field.validationType,
        field.validations,
        field.label
      );
      formSchema[field.attribute] = fieldSchema;
    }
  }
  const schema = yup.object(formSchema).required();

  return { schema };
}

function getFieldSchema<T extends keyof SchemaType>(
  schemaType?: T,
  validations?: Array<Validation>,
  label?: string
): SchemaType[T] {
  let schema: any;

  switch (schemaType) {
    case "string":
      schema = yup.string();
      break;
    case "number":
      schema = yup.number();
      break;
    case "boolean":
      schema = yup.boolean();
      break;
    case "date":
      schema = yup.date();
      break;
    case "array":
      schema = yup.array();
      break;
    case "mixed":
    default:
      schema = yup.mixed();
      break;
  }

  schema.optional().label(label || "This");

  for (let [key, value] of validations || []) {
    if (value === true) {
      schema = schema[key]();
    } else {
      if (Array.isArray(value) && !["oneOf", "notOneOf"].includes(key)) {
        schema = schema[key](...value);
      } else {
        schema = schema[key](value);
      }
    }
  }
  return schema;
}

export { useValidation };

export type SchemaType = {
  string: yup.StringSchema;
  number: yup.NumberSchema;
  boolean: yup.BooleanSchema;
  date: yup.DateSchema;
  array: yup.ArraySchema<yup.AnySchema>;
  mixed: yup.AnySchema;
};
