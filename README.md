# React Material UI Form Builder

An easy-to-use and quick form builder with validation using the following React [Material UI](https://material-ui.com/) input components:

- TextField
- Select
- KeyboardDatePicker
- KeyboardDateTimePicker
- KeyboardTimePicker
- Autocomplete
- Chip
- Checkbox
- Radio
- Switch
- ImageList
- Rating

Validation is done using [yup](https://github.com/jquense/yup).

This project aims to make building standard forms a breeze while leveraging Material UI components to create a more familiar UI. See below for usage examples.

## Installation

```
npm install --save @jeremyling/react-material-ui-form-builder
```

The following packages are peer dependencies and must be install for this package to work.

```
@date-io/date-fns
date-fns
@jeremyling/react-material-ui-rich-text-editor
@material-ui/core
@material-ui/icons
@material-ui/lab
@material-ui/pickers
lodash
react-beautiful-dnd
react-color
react-player
```

## Usage Example

Suppose you need to submit a form with the following structure:

```jsx
// Employee
{
  name: "First Last",
  email: "firstlast@email.com",
  jobId: 1,
  status: "Active",
  skills: ["People Management"],
  subordinates: [2, 3],
  details: {
    joinDate: "2021-01-01",
  },
  profilePicFile: "",
}
```

Subordinates are other employees with the same data structure as above. Other data you have include:

```jsx
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
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  flexRow: {
    flexDirection: "row",
  },
}));

export default function EmployeeForm(props) {
  const [form, setForm] = useState({});

  const updateForm = (updates) => {
    const copy = JSON.parse(JSON.stringify(form));
    for (const [key, value] of Object.entries(updates)) {
      _.set(copy, key, value);
    }
    setForm(copy);
  };

  const fields = [
    {
      component: "display-text",
      titleProps: {
        variant: "h6",
      },
      title: "Create Employee",
    },
    {
      component: "display-image",
      src: "https://via.placeholder.com/800x450?text=Create+Employee",
      alt: "Create Employee",
      props: {
        style: {
          height: 225,
          width: 400,
          objectFit: "cover",
        },
      },
    },
    {
      // Default component is Material UI's TextField
      attribute: "name",
      label: "Name",
      col: {
        // Here you can specify how many Grid columns the field should take for the corresponding breakpoints
        sm: 6,
      },
      validationType: "string",
      validations: {
        required: true,
        max: 50,
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
      },
      validationType: "string",
      validations: {
        required: true,
        email: true,
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
        // Here you can pass any props that are accepted by Material UI's FormControlLabel component
        variant: "body2",
      },
      groupContainerProps: {
        // Here you can pass any props that are accepted by Material UI's FormControl component
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
        // Here you can pass any props that are accepted by Material UI's FormControlLabel component
        variant: "body2",
      },
      groupContainerProps: {
        // Here you can pass any props that are accepted by Material UI's FormControl component
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
        checked: _.get(form, "status") === "Active",
        onChange: (event) =>
          event.target.checked
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
      groupContainerProps: {
        // Here you can pass any props that are accepted by Material UI's FormControl component
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
      hideCondition:
        (jobs.find((j) => j.id === form.jobId) || {}).title ===
        "Entry Level Staff", // This will hide the form field if the condition is truthy
    },
    {
      attribute: "profilePicFile",
      label: "Select Image",
      component: "file-upload",
      acceptTypes: "image/*",
      maxSizeMb: 1,
      props: {
        // Here you can pass any props that are accepted by the input component
      },
    },
  ];

  return (
    <FormBuilder
      fields={fields}
      form={form}
      updateForm={(updates) => updateForm(updates)}
    />
  );
}
```

## Props

| Prop       | Type                 | Default           | Description                                                                                                             |
| ---------- | -------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| title      | `string`             | `undefined`       | Form title                                                                                                              |
| fields     | `array`              | required          | Array of form fields along with props (details below)                                                                   |
| form       | `object`             | required          | Form object to be filled                                                                                                |
| updateForm | `func`               | `(updates) => {}` | Method to update form. `updates` is an object of the form `{ [key]: value }` and will update all `form[key]` to `value` |
| children   | `node`               | `undefined`       | Additional content to the right of the form                                                                             |
| index      | `string` or `number` | `undefined`       | To uniquely identify fields if FormBuilder is used in a loop                                                            |
| idPrefix   | `string`             | `undefined`       | To uniquely identify fields if multiple fields use the same attribute                                                   |

## Field Props

| Prop                | Type                | Default                                                                                                                                                                                        | Description                                                                                                                                                                                                                                                                                                                                                           |
| ------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| attribute           | `string`            | `undefined`                                                                                                                                                                                    | Form attribute that controls input and is modified by input                                                                                                                                                                                                                                                                                                           |
| label               | `string`            | `undefined`                                                                                                                                                                                    | Component label for `text-field`, `select`, `autocomplete`, `date-picker`, `date-time-picker`, `time-picker`, `switch`. Can be omitted if label is not required.                                                                                                                                                                                                      |
| title               | `string`            | `undefined`                                                                                                                                                                                    | Title for component. Can be used to describe input or hold a question.                                                                                                                                                                                                                                                                                                |
| titleProps          | `object`            | `undefined`                                                                                                                                                                                    | Title props passed to Typography component wrapping title                                                                                                                                                                                                                                                                                                             |
| titleSuffix         | `string`            | `undefined`                                                                                                                                                                                    | Title suffix to append to title. Could be used to denote required fields                                                                                                                                                                                                                                                                                              |
| titleSuffixProps    | `object`            | `undefined`                                                                                                                                                                                    | Title suffix props passed to Typography component wrapping title suffix                                                                                                                                                                                                                                                                                               |
| titleContainerProps | `object`            | `undefined`                                                                                                                                                                                    | Props passed to container wrapping the title and titleSuffix                                                                                                                                                                                                                                                                                                          |
| col                 | `object`            | `{ xs: 12 }`                                                                                                                                                                                   | Grid columns that component should take                                                                                                                                                                                                                                                                                                                               |
| component           | `string`            | `text-field`                                                                                                                                                                                   | One of: <br />`text-field`,<br />`select`,<br />`date-picker`,<br />`date-time-picker`,<br />`time-picker`,<br />`autocomplete`,<br />`chip-group`,<br />`checkbox-group`,<br />`radio-group`,<br />`switch`,<br />`file-upload`,<br />`image-picker`, <br />`rating`<br />`display-text`,<br />`display-image`,<br />`display-media`,<br />`rich-text`<br />`custom` |
| options             | `array`             | `[]`                                                                                                                                                                                           | Required if component is one of `select`, `autocomplete`, `chip-group`, `checkbox-group` or `radio-group`                                                                                                                                                                                                                                                             |
| optionConfig        | `object`            | select, chip-group, checkbox-group, radio-group: <br />`{ key: option, value: option, label: option }`<br />autocomplete: <br />`{ value: option, label: option }`                             | Required if options is an array of objects                                                                                                                                                                                                                                                                                                                            |
| randomizeOptions    | `bool`              | `undefined`                                                                                                                                                                                    | If true, randomises option order on each render                                                                                                                                                                                                                                                                                                                       |
| multiple            | `bool`              | `undefined`                                                                                                                                                                                    | Only for `chip-group`, `checkbox-group` and `image-picker`. If true, multiple options will be selectible                                                                                                                                                                                                                                                              |
| sortable            | `bool`              | `undefined`                                                                                                                                                                                    | Only for `autocomplete`. If true, selected options will be sortable via drag and drop                                                                                                                                                                                                                                                                                 |
| acceptTypes         | `string` or `array` | `[".pdf", ".doc", ".docx", ".xml", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".xls", ".xlsx", ".csv", "image/*", "audio/*", "video/*"]` | Only for `file-upload`. Concatenated value will be passed as `accept` prop to `input`                                                                                                                                                                                                                                                                                 |
| maxSizeMb           | `number`            | `2`                                                                                                                                                                                            | Only for `file-upload`. Max size of each uploaded file.                                                                                                                                                                                                                                                                                                               |
| fileType            | `string`            | `undefined`                                                                                                                                                                                    | Only for `file-upload`. One of: `file`, `image`, `audio`, `video`.                                                                                                                                                                                                                                                                                                    |
| imageUrl            | `string`            | `undefined`                                                                                                                                                                                    | Only for `file-upload`. If file type is an image, you may specify the url of the existing image here.                                                                                                                                                                                                                                                                 |
| imageSize           | `array`             | `undefined`                                                                                                                                                                                    | Only for `file-upload`. Size of image preview in the form `[width, height]`. imageSize supercedes aspectRatio.                                                                                                                                                                                                                                                        |
| aspectRatio         | `array`             | `undefined`                                                                                                                                                                                    | Only for `file-upload` and `image-picker`. Aspect ratio of image preview in the form `[width, height]`. imageSize supercedes aspectRatio.                                                                                                                                                                                                                             |
| src                 | `string`            | `undefined`                                                                                                                                                                                    | Only for `display-image` and `display-media`. Source of image or media.                                                                                                                                                                                                                                                                                               |
| alt                 | `string`            | `undefined`                                                                                                                                                                                    | Only for `display-image`. Alt passed to `img` node.                                                                                                                                                                                                                                                                                                                   |
| images              | `array`             | `undefined`                                                                                                                                                                                    | Only for `image-picker`. This should contain an array of objects with attributes `src`, `label` and `alt` (defaults to `label`)                                                                                                                                                                                                                                       |
| imageCols           | `number`            | `{ xs: 2 }`                                                                                                                                                                                    | Only for `image-picker`. Number of columns in image list. This should be an object with breakpoints `xs`, `sm`, `md`, `lg`, `xl` as keys. Columns for each breakpoint default to the previous breakpoint is not specified                                                                                                                                             |
| iconColor           | `string`            | `undefined`                                                                                                                                                                                    | Only for `rating`. Icon colour                                                                                                                                                                                                                                                                                                                                        |
| inputMin            | `number`            | `undefined`                                                                                                                                                                                    | Only for `counter`. Minimum value allowed                                                                                                                                                                                                                                                                                                                             |
| inputMax            | `number`            | `undefined`                                                                                                                                                                                    | Only for `rating`. Maximum value allowed                                                                                                                                                                                                                                                                                                                              |
| defaultValue        | `number`            | `0`                                                                                                                                                                                            | Only for `counter`. Default value to set to                                                                                                                                                                                                                                                                                                                           |
| width               | `number`            | `undefined`                                                                                                                                                                                    | Only for `display-media`. Width of media player.                                                                                                                                                                                                                                                                                                                      |
| height              | `number`            | `undefined`                                                                                                                                                                                    | Only for `display-media`. Height of media player.                                                                                                                                                                                                                                                                                                                     |
| labelLines          | `number`            | `2`                                                                                                                                                                                            | Only for `image-picker`. Number of lines allowed for label                                                                                                                                                                                                                                                                                                            |
| props               | `object`            | `undefined`                                                                                                                                                                                    | Any additional props to pass to the Material UI component                                                                                                                                                                                                                                                                                                             |
| containerProps      | `object`            | `undefined`                                                                                                                                                                                    | Any additional props to pass to the Material UI Grid item that contains the component                                                                                                                                                                                                                                                                                 |
| labelProps          | `object`            | `undefined`                                                                                                                                                                                    | Only for `checkbox-group`, `radio-group` and `switch`, `image-picker`. Any additional props to pass to Material UI's FormControlLabel or Typography (`image-picker`) that wraps the label.                                                                                                                                                                            |
| groupContainerProps | `object`            | `undefined`                                                                                                                                                                                    | Only for `chip-group`, `checkbox-group`, `radio-group` and `image-picker`. Any additional props to pass to Material UI's FormControlGroup or ImageList (`image-picker`) that wraps the individual components within the group.                                                                                                                                        |
| hideCondition       | `bool`              | `undefined`                                                                                                                                                                                    | Hides field if truthy                                                                                                                                                                                                                                                                                                                                                 |
| customComponent     | `func`              | `undefined`                                                                                                                                                                                    | Function that accepts the props `(field, form, updateForm)` and returns a node                                                                                                                                                                                                                                                                                        |
| validationType^     | `string`            | `undefined`                                                                                                                                                                                    | One of: `mixed`, `string`, `number`, `date`, `boolean`, `array`.                                                                                                                                                                                                                                                                                                      |
| validations^        | `object`            | `undefined`                                                                                                                                                                                    | These are validation options accepted by `yup` in the form of `{validation: arguments}`. Arguments can be a `string` or an `array` of strings in the order that it is accepted by the `yup` option. For validations that do not require any arguments, set the argument to `true`.                                                                                    |

^See below for examples

## Rich Text Field Props

| Prop           | Type     | Default        | Description                                                                                                                                           |
| -------------- | -------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| html           | `string` | `undefined`    | HTML to be deserialized as content. Document takes precedence.                                                                                        |
| document       | `array`  | `undefined`    | Document set as value for the Slate Context Provider. Takes precedence over HTML                                                                      |
| onChange       | `func`   | `() => {}`     | Method passed to Slate Context Provider's onChange prop                                                                                               |
| onBlur         | `func`   | `(html) => {}` | Additional method to run triggered by the onBlur event on the wrapper component. By default, the serialized html will be passed as the only argument. |
| containerProps | `object` | `undefined`    | Props to pass to the Material UI Paper wrapper                                                                                                        |
| editableProps  | `object` | `undefined`    | Props to pass to the Slate Editable component                                                                                                         |

## Validation

Validation is done using yup, which has 6 core types that inherit from the `mixed` type: `string`, `number`, `boolean`, `date`, `array` and `object`. For this project, it should be sufficient to use only `string` and `number` for the various components. In fact, other than the `text-field` component, it is unlikely you would need any validation beyond `required`. Here are some examples of how you might use validation.

```jsx
// Example field 1
{
  attribute: ...,
  component: 'text-field',
  label: ...,
  validationType: 'string',
  validations: {
    required: true,
    length: 10,
    min: 5,
    max: 20,
    matches: [/[a-z]/i, 'Can only contain letters'],
    email: true,
    url: true,
    uuid: true,
  }
}

// Example field 2
{
  attribute: ...,
  component: 'text-field',
  props: {
    type: 'number',
  },
  label: ...,
  validationType: 'number',
  validations: {
    required: true,
    min: 5,
    max: 20,
    lessThan: 20,
    moreThan: 5,
    positive: true,
    negative: true,
    integer: true,
  }
}
```

For dates, most validation can already be done with Material UI's pickers.
