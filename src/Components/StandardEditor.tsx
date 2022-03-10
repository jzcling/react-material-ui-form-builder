import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Editor } from "@jeremyling/react-material-ui-rich-text-editor";

import { CommonFieldProps, RichTextFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";

export interface StandardEditorProps
  extends CommonFieldProps<"rich-text">,
    RichTextFieldProps {
  attribute: Required<CommonFieldProps<"rich-text">>["attribute"];
}

export default function StandardEditor(props: { field: StandardEditorProps }) {
  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();
  const { field: fieldConfig } = props;
  const [touched, setTouched] = useState<boolean>(false);

  useEffect(() => {
    if (touched) {
      trigger(fieldConfig.attribute);
    }
  }, [touched]);

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      render={({ field }) => (
        <div onFocus={() => setTouched(true)}>
          <Editor
            html={field.value}
            updateHtml={(html: string) => setValue(fieldConfig.attribute, html)}
            containerProps={fieldConfig.groupContainerProps}
            editableProps={fieldConfig.props}
          />
          {!!errors[fieldConfig.attribute] && (
            <ErrorText error={errors[fieldConfig.attribute]?.message} />
          )}
        </div>
      )}
    />
  );
}
