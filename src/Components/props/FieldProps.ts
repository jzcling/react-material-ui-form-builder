import React, { DetailedHTMLProps } from "react";
import { EditableProps } from "slate-react/dist/components/editable";

import { DatePickerProps, DateTimePickerProps, TimePickerProps } from "@mui/lab";
import {
  AutocompleteProps, BoxProps, ButtonBaseProps, CheckboxProps, ChipProps, FormControlLabelProps,
  FormControlProps, GridProps, ImageListProps, PaperProps, RadioProps, RatingProps, SelectProps,
  StandardProps, SwitchProps, TextFieldProps, TypographyProps
} from "@mui/material";

import { AutocompleteOptionConfig } from "../../utils/autocomplete";
import { OptionConfig } from "../../utils/options";
import { TitleProps } from "../widgets/Title";

export interface CommonFieldProps {
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
   * `autocomplete-dnd`,
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
   * `autocomplete-dnd`,
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
  component?:
    | "text-field"
    | "select"
    | "date-picker"
    | "date-time-picker"
    | "time-picker"
    | "autocomplete"
    | "autocomplete-dnd"
    | "chip-group"
    | "checkbox-group"
    | "radio-group"
    | "switch"
    | "file-upload"
    | "image-picker"
    | "rating"
    | "counter"
    | "display-text"
    | "display-image"
    | "display-media"
    | "rich-text"
    | "custom";
  /** Any additional props to pass to the Material UI component */
  props?:
    | TextFieldProps
    | SelectProps
    | DatePickerProps<Date>
    | DateTimePickerProps<Date>
    | TimePickerProps<Date>
    | AutocompleteProps<unknown, true, true, true>
    | AutocompleteProps<unknown, false, true, true>
    | ChipProps
    | CheckboxProps
    | RadioProps
    | SwitchProps
    | ButtonBaseProps
    | RatingProps
    | BoxProps
    | DetailedHTMLProps<
        React.HTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >;
  /** Any additional props to pass to the Material UI Grid item that contains the component */
  containerProps?: GridProps;
  /** Hides field if truthy */
  hideCondition?: boolean;
  /** One of: `mixed`, `string`, `number`, `date`, `boolean`, `array` */
  validationType?: "mixed" | "string" | "number" | "date" | "boolean" | "array";
  /** These are validation options accepted by `yup` in the form of `{validation: arguments}`.
   * Arguments can be a `string` or an `array` of strings in the order that it is accepted
   * by the `yup` option. For validations that do not require any arguments, set the argument
   * to `true`. */
  validations?: Array<Validation>;
  /** Function that accepts the props `(field, ref)` and returns a node */
  customComponent?: (field: unknown, ref: React.Ref<unknown>) => JSX.Element;
}

export interface MultiOptionFieldProps<T = unknown> {
  /** Required for `select`, `checkbox-group` and `radio-group` */
  options: Array<T | Record<string, T>>;
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

export interface AutocompleteFieldProps<T = unknown> {
  options: Array<T | Record<string, T>>;
  /**
   * `{ value?: optionKey, label: optionKey }`
   *
   * Leave value undefined for entire object
   * */
  optionConfig?: AutocompleteOptionConfig;
  /** If true, randomises option order on each render */
  randomizeOptions?: boolean;
  /**
   * Only for `autocomplete-dnd`.
   *
   * If true, selected options will be sortable via drag and drop */
  sortable?: boolean;
}

export interface CustomChipGroupFieldProps {
  options: Array<string | number | Record<string, unknown>>;
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
  /** HTML to be deserialized as content */
  html?: string;
  /** Method to update html, taking serialized html as argument */
  updateHtml?: (html: string) => void;
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

interface Validation {}

export interface ImagePickerObject {
  src: string;
  label: string;
  subLabel?: string;
  alt?: string;
  customComponent: JSX.Element;
}

export const FileType = {
  File: "file",
  Image: "image",
  Audio: "audio",
  Video: "video",
} as const;
export type FileType = typeof FileType[keyof typeof FileType];
