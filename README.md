# React Material UI Form Builder

An easy-to-use and quick form builder using the following React Material UI input components:

- TextField
- Select
- KeyboardDatePicker
- KeyboardDateTimePicker
- Autocomplete

This project aims to make building standard forms a breeze while leveraging Material UI components to create a more familiar UI. See below for usage examples.

## Installation

```
npm install --save @jeremyling/react-material-ui-form-builder
```

## Usage Example

Suppose you need to submit a form with the following structure:

```javascript
// Employee
{
  name: "First Last",
  email: "firstlast@email.com",
  jobId: 1,
  status: "Active",
  subordinates: [2, 3],
  details: {
    joinDate: '2021-01-01',
  },
}
```

Subordinates are other employees with the same data structure as above. Other data you have include:

```javascript
const employees = [
  {
    id: 1,
    name: "First Employee"
    ...
  },
  {
    id: 2,
    name: "Second Employee"
    ...
  },
  {
    id: 3,
    name: "Third Employee"
    ...
  },
];

const jobs = [
  {
    id: 1,
    title: "Manager",
  },
  {
    id: 2,
    title: "Entry Level Staff",
  },
];

const statuses = ["Active", "Inactive"];
```

With the predefined data above, the following functional component illustrates how FormBuilder is used.

```jsx
import React, { useState } from "react";
import FormBuilder from "@jeremyling/react-material-ui-form-builder";
import _ from "lodash";

const fields = (jobs, form, errors, validateEmail) => [
  {
    // Default component is Material UI's TextField
    attribute: "name",
    label: "Name",
    col: {
      // Here you can specify how many Grid columns the field should take for the corresponding breakpoints
      sm: 6,
    },
  },
  {
    attribute: "email",
    label: "Email",
    col: {
      sm: 6,
    },
    component: "text-field",
    props: {
      // Here you can pass any props that are accepted by Material UI's TextField component
      error: !!errors.email,
      helperText: errors.email,
      onBlur: (event) => validateEmail(form.email),
    },
  },
  {
    attribute: "jobId",
    label: "Job",
    col: {
      sm: 4,
    },
    component: "select",
    options: jobs,
    // If options is an array of objects, optionConfig is required
    optionConfig: {
      key: "id", // The attribute to use for the key required for each option
      value: "id", // The attribute to use to determine the value that should be passed to the form field
      label: "title", // The attribute to use to determine the label for the select option
    },
  },
  {
    attribute: "status",
    label: "Status",
    col: {
      sm: 4,
    },
    component: "select",
    options: statuses, // optionConfig not required as options is an array of strings
  },
  {
    attribute: "details.joinDate",
    label: "Join Date",
    col: {
      sm: 4,
    },
    component: "date-picker",
    props: {
      // Here you can pass any props that are accepted by Material UI's KeyboardDatePicker component
    },
  },
  {
    attribute: "subordinates",
    label: "Subordinates",
    component: "autocomplete",
    options: employees,
    props: {
      // Here you can pass any props that are accepted by Material UI's Autocomplete component
      autoHighlight: true,
      multiple: true,
    },
    hideCondition: form.title === "Entry Level Staff", // This will hide the form field if the condition is truthy
  },
];

export default function EmployeeForm(props) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const updateForm = (key, value) => {
    const copy = JSON.parse(JSON.stringify(form));
    _.set(copy, key, value);
    setForm(copy);
  };

  const updateErrors = (key, value) => {
    const copy = JSON.parse(JSON.stringify(errors));
    _.set(copy, key, value);
    setErrors(copy);
  };

  const validateEmail = (email) => {
    if (!email) {
      updateErrors("email", "Email is required");
      return;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      updateErrors("email", "Invalid email");
      return;
    }
    updateErrors("email", null);
  };

  return (
    <FormBuilder
      fields={fields(jobs, form, errors, validateEmail)}
      form={form}
      updateForm={(key, value) => updateForm(key, value)}
    />
  );
}
```

## Props

| Prop       | Type                 | Default              | Description                                                           |
| ---------- | -------------------- | -------------------- | --------------------------------------------------------------------- |
| title      | `string`             | `undefined`          | Form title                                                            |
| fields     | `array`              | required             | Array of form fields along with props (details below)                 |
| form       | `object`             | required             | Form object to be filled                                              |
| updateForm | `func`               | `(key, value) => {}` | Method to update `form[key]` to `value`                               |
| children   | `node`               | `undefined`          | Additional content to the right of the form                           |
| index      | `string` or `number` | `undefined`          | To uniquely identify fields if FormBuilder is used in a loop          |
| idPrefix   | `string`             | `undefined`          | To uniquely identify fields if multiple fields use the same attribute |

## Field Props

| Prop          | Type     | Default                                                                                                                            | Description                                                                                                 |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| attribute     | `string` | `undefined`                                                                                                                        | Form attribute used to be modified by input                                                                 |
| label         | `string` | `undefined`                                                                                                                        | Component label                                                                                             |
| col           | `object` | `{ xs: 12 }`                                                                                                                       | Grid columns that component should take                                                                     |
| component     | `string` | `text-field`                                                                                                                       | One of: <br />`text-field`,<br />`select`,<br />`date-picker`,<br />`date-time-picker`,<br />`autocomplete` |
| options       | `array`  | `undefined`                                                                                                                        | Required if component is `select` or `autocomplete`                                                         |
| optionConfig  | `object` | select: <br />`{ key: option, value: option, label: option }`<br />autocomplete: <br />`{ key: "id", value: "id", label: "name" }` | Required if options is an array of objects                                                                  |
| props         | `object` | `undefined`                                                                                                                        | Any additional props to pass to Material UI component                                                       |
| hideCondition | `bool`   | `undefined`                                                                                                                        | Hides field if truthy                                                                                       |
