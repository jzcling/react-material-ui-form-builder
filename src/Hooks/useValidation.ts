import React from "react";
import * as yup from "yup";

import { FieldProp } from "../components/FormBuilder";
import { SchemaType, ValidationMethod } from "../components/props/FieldProps";

function useValidation(fields: Array<FieldProp>) {
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

function getFieldSchema(
  schemaType?: SchemaType,
  validations?: Array<
    [ValidationMethod, true | string | number | RegExp | Array<any>]
  >,
  label?: string
): any {
  let schema: any;

  schema = schema[schemaType || "mixed"]();

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
