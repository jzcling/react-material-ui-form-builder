# React Material UI Form Builder

An easy-to-use and quick form builder using the following React Material UI input components:

- TextField
- Select
- KeyboardDatePicker
- KeyboardDateTimePicker
- Autocomplete
- Chip
- Checkbox
- Radio
- Switch

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
  skills: ['People Management'],
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

const skills = [
  'Data Entry',
  'People Management',
];

const statuses = ["Active", "Inactive"];
```

With the predefined data above, the following functional component illustrates how FormBuilder is used.

```jsx
import React, { useState } from "react";
import FormBuilder from "@jeremyling/react-material-ui-form-builder";
import _ from "lodash";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  flexRow: {
    flexDirection: "row",
  },
}));

export default function EmployeeForm(props) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const updateForm = (key, value) => {
    const copy = JSON.parse(JSON.stringify(form));
    _.set(copy, key, value);
    setForm(copy);
  };

  const updateErrors = (key, value) => {
    ...
  };

  const validateEmail = (email) => {
    // Update errors on failed validation
    ...
  };

  const fields = [
    {
      component: 'display-text',
      titleProps: {
        variant: 'h6',
      },
      title: 'Create Employee',
    },
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
        sm: 6,
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
      attribute: "details.joinDate",
      label: "Join Date",
      col: {
        sm: 6,
      },
      component: "date-picker",
      props: {
        // Here you can pass any props that are accepted by Material UI's KeyboardDatePicker component
      },
    },
    {
      attribute: "status",
      label: "Status",
      col: {
        sm: 6,
      },
      component: "select",
      options: statuses, // optionConfig not required as options is an array of strings
      props: {
        // Here you can pass any props that are accepted by Material UI's Select component
      },
      idPrefix: "select",
    },
    {
      attribute: "status",
      title: "Status", // You can omit this if you do not want a title for the field
      col: {
        sm: 6,
      },
      component: "checkbox-group",
      options: ["Active"], // Single option for a single checkbox
      props: {
        // Here you can pass any props that are accepted by Material UI's Checkbox component
        onChange: (event) => {
          if (event.target.checked) {
            updateForm("status", "Active");
          } else {
            updateForm("status", "Inactive");
          }
        },
      },
      labelProps: {
        // Here you can pass any props that are accepted by Material UI's Typography component
        variant: "body2",
      },
      groupContainerProps: {
        // Here you can pass any props that are accepted by Material UI's FormGroup component
      },
      idPrefix: "checkbox",
    },
    {
      attribute: "status",
      title: "Status", // You can omit this if you do not want a title for the field
      col: {
        sm: 6,
      },
      component: "radio-group",
      options: statuses,
      props: {
        // Here you can pass any props that are accepted by Material UI's Radio component
        color: "secondary",
      },
      labelProps: {
        // Here you can pass any props that are accepted by Material UI's Typography component
        variant: "body2",
      },
      groupContainerProps: {
        // Here you can pass any props that are accepted by Material UI's FormGroup component
        classes: {
          root: classes.flexRow,
        },
      },
      idPrefix: "radio",
    },
    {
      attribute: "status",
      label: "Active",
      col: {
        sm: 6,
      },
      component: "switch",
      props: {
        // Here you can pass any props that are accepted by Material UI's Radio component
        color: "secondary",
        checked: _.get(form, "status") === 'Active',
        onChange: (event) => event.target.checked
          ? updateForm("status", "Active")
          : updateForm("status", "Inactive"),
      },
      idPrefix: "switch",
    },
    {
      attribute: "skills",
      label: "Skills",
      col: {
        sm: 12,
      },
      component: "chip-group",
      options: skills, // optionConfig not required as options is an array of strings
      multiple: true, // Allow multiple selections
      props: {
        // Here you can pass any props that are accepted by Material UI's Chip component
      },
      labelProps: {
        // Here you can pass any props that are accepted by Material UI's Typography component
        variant: "body2",
      },
      groupContainerProps: {
        // Here you can pass any props to a div wrapper
        style: { overflow: auto },
      },
    },
    {
      attribute: "subordinates",
      label: "Subordinates",
      component: "autocomplete",
      options: employees,
      optionConfig: {
        value: "id",
        label: "name",
      },
      props: {
        // Here you can pass any props that are accepted by Material UI's Autocomplete component
        autoHighlight: true,
        multiple: true,
      },
      hideCondition: (jobs.find((j) => j.id === form.jobId) || {}).title === "Entry Level Staff", // This will hide the form field if the condition is truthy
    },
  ];

  return (
    <FormBuilder
      fields={fields}
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

| Prop                | Type     | Default                                                                                                                                                            | Description                                                                                                                                                                                                   |
| ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| attribute           | `string` | `undefined`                                                                                                                                                        | Form attribute that controls input and is modified by input                                                                                                                                                   |
| label               | `string` | `undefined`                                                                                                                                                        | Component label for `text-field`, `select`, `autocomplete`, `date-picker`, `date-time-picker`, `switch`. Can be omitted if label is not required.                                                             |
| title               | `string` | `undefined`                                                                                                                                                        | Title for component. Can be used to describe input or hold a question.                                                                                                                                        |
| col                 | `object` | `{ xs: 12 }`                                                                                                                                                       | Grid columns that component should take                                                                                                                                                                       |
| component           | `string` | `text-field`                                                                                                                                                       | One of: <br />`text-field`,<br />`select`,<br />`date-picker`,<br />`date-time-picker`,<br />`autocomplete`,<br />`chip-group`,<br />`checkbox-group`,<br />`radio-group`,<br />`switch`,<br />`display-text` |
| options             | `array`  | `[]`                                                                                                                                                               | Required if component is one of `select`, `autocomplete`, `chip-group`, `checkbox-group` or `radio-group`                                                                                                     |
| optionConfig        | `object` | select, chip-group, checkbox-group, radio-group: <br />`{ key: option, value: option, label: option }`<br />autocomplete: <br />`{ value: option, label: option }` | Required if options is an array of objects                                                                                                                                                                    |
| multiple            | `bool`   | `undefined`                                                                                                                                                        | Only for `chip-group` and `checkbox-group`. If true, multiple options will be selectible                                                                                                                      |
| props               | `object` | `undefined`                                                                                                                                                        | Any additional props to pass to the Material UI component                                                                                                                                                     |
| containerProps      | `object` | `undefined`                                                                                                                                                        | Any additional props to pass to the Material UI Grid item that contains the component                                                                                                                         |
| labelProps          | `object` | `undefined`                                                                                                                                                        | Only for `checkbox-group`, `radio-group` and `switch`. Any additional props to pass to Material UI's FormControlLabel that wraps the label.                                                                   |
| groupContainerProps | `object` | `undefined`                                                                                                                                                        | Only for `chip-group`, `checkbox-group` and `radio-group`. Any additional props to pass to Material UI's FormControlGroup that wraps the individual components within the group.                              |
| hideCondition       | `bool`   | `undefined`                                                                                                                                                        | Hides field if truthy                                                                                                                                                                                         |
