import React, { DetailedHTMLProps, MouseEventHandler } from "react";
import { ReactPlayerProps } from "react-player";
import { EditableProps } from "slate-react/dist/components/editable";

import { DatePickerProps, DateTimePickerProps, TimePickerProps } from "@mui/lab";
import {
  AutocompleteProps, BoxProps, ButtonBaseProps, CheckboxProps, ChipProps, FormControlLabelProps,
  FormControlProps, GridProps, ImageListProps, PaperProps, RadioProps, RatingProps, SelectProps,
  SwitchProps, TextFieldProps, TypographyProps
} from "@mui/material";

import { SchemaType } from "../../hooks/useValidation";
import { AutocompleteOptionConfig } from "../../utils/autocomplete";
import { Option, OptionConfig } from "../../utils/options";
import { TitleProps } from "../widgets/Title";

export interface CommonFieldProps<T extends keyof ComponentType> {
  id?: string;
  /** Form attribute that controls input and is modified by input.
   * Also acts as id
   */
  attribute?: string;
  /** Component label for
   *
   * `text-field`,
   *
   * `select`,
   *
   * `autocomplete`,
   *
   * `date-picker`,
   *
   * `date-time-picker`,
   *
   * `time-picker`,
   *
   * `switch`.
   *
   * Can be omitted if label is not required. */
  label?: string;
  /** Title for component. Can be used to describe input or hold a question. */
  title?: TitleProps["title"];
  /** Title props passed to Typography component wrapping title */
  titleProps?: TitleProps["titleProps"];
  /** Title suffix component to append to title. Supercedes titleSuffix */
  titleSuffixComponent?: TitleProps["titleSuffixComponent"];
  /** Title suffix to append to title. Could be used to denote required fields */
  titleSuffix?: TitleProps["titleSuffix"];
  /** Title suffix props passed to span component wrapping title suffix */
  titleSuffixProps?: TitleProps["titleSuffixProps"];
  /** Props passed to Box container wrapping the title and titleSuffix */
  titleContainerProps?: TitleProps["titleContainerProps"];
  /** Grid columns that component should take. e.g. { xs: 12 } */
  col?: GridColMap;
  /**
   * One of:
   *
   * `text-field`,
   *
   * `select`,
   *
   * `date-picker`,
   *
   * `date-time-picker`,
   *
   * `time-picker`,
   *
   * `autocomplete`,
   *
   * `chip-group`,
   *
   * `checkbox-group`,
   *
   * `radio-group`,
   *
   * `switch`,
   *
   * `file-upload`,
   *
   * `image-picker`,
   *
   * `rating`,
   *
   * `counter`,
   *
   * `display-text`,
   *
   * `display-image`,
   *
   * `display-media`,
   *
   * `rich-text`,
   *
   * `custom`
   * */
  component: T;
  // | "text-field"
  // | "select"
  // | "date-picker"
  // | "date-time-picker"
  // | "time-picker"
  // | "autocomplete"
  // | "chip-group"
  // | "checkbox-group"
  // | "radio-group"
  // | "switch"
  // | "file-upload"
  // | "image-picker"
  // | "rating"
  // | "counter"
  // | "display-text"
  // | "display-image"
  // | "display-media"
  // | "rich-text"
  // | "custom";
  /** Any additional props to pass to the Material UI component */
  props?: ComponentType[T];
  /** Any additional props to pass to the Material UI Grid item that contains the component */
  containerProps?: GridProps;
  /** If true, hides field */
  hideCondition?: boolean;
  /** One of: `mixed`, `string`, `number`, `date`, `boolean`, `array` */
  validationType?: keyof SchemaType;
  /** These are validation options accepted by `yup` in the form of `[validation, arguments]`.
   * Arguments can be a `string`, `number`, `true`, `regex` or an `array` of such in the order that it is accepted
   * by the `yup` option. For validations that do not require any arguments, set the argument
   * to `true`. */
  validations?: Array<Validation>;
  /** Function that accepts the props `(field, ref)` and returns a node */
  customComponent?: (field: unknown) => React.ReactNode;
}

export interface MultiOptionFieldProps<T> {
  /** Required for `select`, `checkbox-group` and `radio-group` */
  options: Array<T>;
  /**
   * Only for `select`, `checkbox-group` and `radio-group`
   *
   * Required if options is an array of objects. Examples:
   *
   * `{ key: optionKey, value?: optionKey, label: optionKey }`
   * */
  optionConfig?: OptionConfig;
  /** Only for `select`, `checkbox-group` and `radio-group`
   *
   * If true, randomises option order on each render */
  randomizeOptions?: boolean;
  /** Only for `checkbox-group`.
   *
   * If true, multiple options will be selectible */
  multiple?: boolean;
  /**
   * Only for `checkbox-group`, `radio-group`.
   *
   * Any additional props to pass to Material UI's FormControlLabel that wraps the label.
   * */
  labelProps?: FormControlLabelProps;
  /**
   * Only for `checkbox-group`, `radio-group`.
   *
   * Any additional props to pass to Material UI's FormGroup that wraps the
   * individual components within the group.
   * */
  groupContainerProps?: FormControlProps;
}

export interface AutocompleteFieldProps<T> {
  options: Array<T>;
  /**
   * Required if options is an array of objects. Examples:
   *
   * `{ value?: optionKey, label: optionKey }`
   *
   * Leave value undefined for entire object
   * */
  optionConfig?: AutocompleteOptionConfig;
  /** If true, randomises option order on each render */
  randomizeOptions?: boolean;
  /** If true, selected options will be sortable via drag and drop */
  sortable?: boolean;
}

export interface ChipGroupFieldProps<T> {
  options: Array<T>;
  /** Required if options is an array of objects. */
  optionConfig?: OptionConfig;
  /** If true, randomises option order on each render */
  randomizeOptions?: boolean;
  /** If true, multiple options will be selectible */
  multiple?: boolean;
  /** Any additional props to pass to span that wraps the label. */
  labelProps?: DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >;
  /** Any additional props to pass to Material UI's FormGroup that wraps the
   * individual components within the group.
   * */
  groupContainerProps?: FormControlProps;
}

export interface SwitchFieldProps {
  /** Options for switch in the form of `[offValue, onValue]`. Values must be
   * `string`, `number` or `boolean`.
   */
  options?: [string | number | boolean, string | number | boolean];
  /**
   * Any additional props to pass to Material UI's FormControlLabel that wraps the label.
   * */
  labelProps?: FormControlLabelProps;
}

export interface DateTimeFieldProps {
  /** If true, will use the Keyboard equivalent components of the pickers */
  keyboard?: boolean;
}

export interface FileUploadFieldProps {
  /**
   * Concatenated value will be passed as `accept` prop to `input`. Default:
   *
   * `[".pdf", ".doc", ".docx", ".xml", "application/msword",
   * "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
   * ".xls", ".xlsx", ".csv", "image/*", "audio/*", "video/*"]`
   * */
  acceptTypes?: string | Array<string>;
  /** Max size of each uploaded file. */
  maxSizeMb?: number;
  fileType?: FileType;
  /** If file type is image, you may specify the urls of the existing images here. */
  imageUrls?: Array<string>;
  /** Size of image preview in the form `[width, height]`.
   * imageSize supercedes aspectRatio. */
  imageSize?: Array<[number, number]>;
  /** Aspect ratio of image preview in the form
   * `[width, height]`. imageSize supercedes aspectRatio. */
  aspectRatio?: Array<[number, number]>;
  /** If true, allows multiple file uploads */
  multiple?: boolean;
}

export interface StandardDisplayTextProps
  extends CommonFieldProps<"display-text"> {}

export interface StandardDisplayImageProps
  extends CommonFieldProps<"display-image">,
    DisplayFieldProps {}

export interface StandardDisplayMediaProps
  extends CommonFieldProps<"display-media">,
    DisplayFieldProps {}

export interface StandardCustomProps extends CommonFieldProps<"custom"> {}

export interface DisplayFieldProps {
  /** Source of image or media. */
  src: string;
  /** Only for `display-image`.
   *
   * Alt passed to `img` node. */
  alt?: string;
  /** Only for `display-media`.
   *
   * Width of media player. */
  width?: number;
  /** Only for `display-media`.
   *
   * Height of media player. */
  height?: number;
}

export interface ImagePickerFieldProps {
  /** This should contain an array of objects
   * with attributes `src`, `label` and `alt` (defaults to `label`) */
  images: Array<ImagePickerObject>;
  /**
   * Number of columns in image list.
   *
   * This should be an object with breakpoints `xs`, `sm`, `md`, `lg`, `xl` as keys.
   *
   * Columns for each breakpoint default to the previous breakpoint is not specified
   * */
  imageCols?: GridColMap;
  /** Number of lines allowed for label */
  labelLines?: number;
  /** Number of lines allowed for sublabel */
  subLabelLines?: number;
  /** Aspect ratio of image preview in the form `[width, height]`. */
  aspectRatio?: Array<[number, number]>;
  /** If true, multiple options will be selectible */
  multiple?: boolean;
  /** Any additional props to pass to the Box component that wraps the img. */
  imageProps?: BoxProps;
  /** Any additional props to pass to the Typography component that wraps the label. */
  labelProps?: TypographyProps;
  /** Any additional props to pass to the Typography component that wraps the sublabel. */
  subLabelProps?: TypographyProps;
  /** Any additional props to pass to the ImageList component that wraps the individual components within the group. */
  groupContainerProps?: ImageListProps;
  getValueKey?: (value: ImagePickerObject) => string;
  getOptionKey?: (option: ImagePickerObject) => string;
}

export interface RatingFieldProps {
  iconColor?: string;
}

export interface CounterFieldProps {
  /** Minimum value allowed */
  inputMin?: number;
  /** Maximum value allowed */
  inputMax?: number;
  /** Counter font size */
  fontSize?: number;
}

export interface RichTextFieldProps {
  /* Props to pass to the Material UI Paper wrapper */
  groupContainerProps?: PaperProps;
  /** Props to pass to the Slate Editable component */
  editableProps?: EditableProps;
}

export interface GridColMap {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export const ValidationMethod = {
  Required: "required",
  Length: "length",
  Min: "min",
  Max: "max",
  Matches: "matches",
  Email: "email",
  Url: "url",
  Uuid: "uuid",
  LessThan: "lessThan",
  MoreThan: "moreThan",
  Positive: "positive",
  Negative: "negative",
  Integer: "integer",
  OneOf: "oneOf",
  NotOneOf: "notOneOf",
  Test: "test",
  When: "when",
} as const;
export type ValidationMethod =
  typeof ValidationMethod[keyof typeof ValidationMethod];

export type Validation = [
  ValidationMethod,
  true | string | number | RegExp | Array<any>
];

export interface ImagePickerObject {
  src: string;
  label: string;
  subLabel?: string;
  alt?: string;
  customComponent: React.ReactNode;
}

export const FileType = {
  File: "file",
  Image: "image",
  Audio: "audio",
  Video: "video",
} as const;
export type FileType = typeof FileType[keyof typeof FileType];

export type ComponentType = {
  "text-field": Partial<TextFieldProps>;
  select: Partial<SelectProps>;
  "date-picker": Partial<DatePickerProps<Date>>;
  "date-time-picker": Partial<DateTimePickerProps<Date>>;
  "time-picker": Partial<TimePickerProps<Date>>;
  autocomplete:
    | Partial<AutocompleteProps<unknown, true, true, true>>
    | Partial<AutocompleteProps<unknown, false, true, true>>;
  "chip-group": Partial<ChipProps> & {
    onClick?: (
      option: Option<unknown>,
      value: unknown | Array<unknown>
    ) => MouseEventHandler;
  };
  "checkbox-group": Partial<CheckboxProps>;
  "radio-group": Partial<RadioProps>;
  switch: Partial<SwitchProps>;
  "file-upload": Partial<
    DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
  >;
  "image-picker": Partial<ButtonBaseProps<"div", { component: "div" }>>;
  rating: Partial<RatingProps>;
  counter: Partial<BoxProps> & { disabled?: boolean };
  "display-text": undefined;
  "display-image": Partial<
    DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >
  >;
  "display-media": Partial<ReactPlayerProps>;
  "rich-text": Partial<EditableProps>;
  custom: any;
};
