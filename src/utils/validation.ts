import set from "lodash/set";
import * as yup from "yup";

import { FieldProp } from "../components/FormBuilder";
import { Validation } from "../components/props/FieldProps";

export function getFormSchema(fields: Array<FieldProp>) {
  const schema = getValidationSchema(fields);
  return schema;
}

export function getFieldSchema<T extends keyof SchemaType>(
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

  schema = schema.optional().label(label || "This");

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
  return schema as SchemaType[T];
}

export type SchemaType = {
  string: yup.StringSchema;
  number: yup.NumberSchema;
  boolean: yup.BooleanSchema;
  date: yup.DateSchema;
  array: yup.ArraySchema<yup.AnySchema>;
  mixed: yup.AnySchema;
};

const getValidationSchema = (fields: Array<FieldProp>) => {
  const schema = fields.reduce((schema, field) => {
    const { attribute, validationType, validations, label } = field;
    if (!attribute) {
      return schema;
    }
    const schemaType = validationType || "mixed";
    if (!yup[schemaType]) {
      return schema;
    }

    const validator = getFieldSchema(validationType, validations, label);

    const isObject = attribute.indexOf(".") >= 0;
    if (!isObject) {
      return schema.concat(yup.object({ [attribute]: validator }));
    }

    const reversePath = attribute.split(".").reverse();
    const currNestedObject = reversePath.slice(1).reduce(
      (yupObj, path) => {
        // current path is a number
        // return object with array key to be handled later
        // this is because we don't know yet what the parent path is
        if (!isNaN(Number(path))) {
          return { array: yup.array(yup.object(yupObj)) };
        }
        // if child is an array, return previously set array schema
        if (yupObj.array) {
          return { [path]: yupObj.array };
        }
        return { [path]: yup.object(yupObj) };
      },
      { [reversePath[0]]: validator }
    );

    const newSchema = yup.object(currNestedObject);
    return schema.concat(newSchema);
  }, yup.object({}).required());

  return schema;
};
