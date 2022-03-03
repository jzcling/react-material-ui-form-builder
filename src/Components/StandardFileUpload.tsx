import React, { DetailedHTMLProps, Fragment, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Button, ButtonBase, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { CommonFieldProps, FileType, FileUploadFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";
import { Title } from "./widgets/Title";

const fileTypes = [
  ".pdf",
  ".doc",
  ".docx",
  ".xml",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls",
  ".xlsx",
  ".csv",
  "image/*",
  "audio/*",
  "video/*",
];

function isString(str: any): boolean {
  if (str && typeof str.valueOf() === "string") {
    return true;
  }
  return false;
}

function flattenDeep<T>(arr: Array<T>): Array<T> {
  return arr.flatMap((subArray) =>
    Array.isArray(subArray) ? flattenDeep(subArray) : subArray
  );
}

export interface StandardFileUploadProps
  extends CommonFieldProps<"file-upload">,
    FileUploadFieldProps {
  attribute: Required<CommonFieldProps<"file-upload">>["attribute"];
}

type FieldConfigProps = {
  fieldConfig: StandardFileUploadProps;
};

type InputProps = {
  error: boolean;
};

const ImageContainerRoot = styled("div")<FieldConfigProps>(
  ({ fieldConfig }) => ({
    display: "inline-block",
    position: "relative",
    width: fieldConfig.imageSize?.[0] || undefined,
    height: fieldConfig.imageSize?.[1] || undefined,
  })
);

const ImageSizer = styled("div")<FieldConfigProps>(({ fieldConfig }) => ({
  marginTop: `${
    (Number(fieldConfig.imageSize?.[1] || fieldConfig.aspectRatio?.[1] || 1) /
      Number(fieldConfig.imageSize?.[0] || fieldConfig.aspectRatio?.[0] || 1)) *
    100
  }%`,
}));

const ImageContainer = styled("div")(() => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
}));

const Image = styled("img")(() => ({
  width: "100%",
  height: "100%",
  objectFit: "contain",
}));

const Input = styled(Typography)<InputProps>(({ theme, error }) => ({
  textAlign: "start",
  border: `1px solid ${error ? theme.palette.error.main : "#b9b9b9"}`,
  borderRadius: "4px",
  padding: "7px 10px",
  color: "rgba(0, 0, 0, 0.87)",
  overflow: "hidden",
  whiteSpace: "nowrap",
  margin: theme.spacing(1, 0),
}));

const StyledButtonBase = styled(ButtonBase)(() => ({
  width: "100%",
  display: "block",
})) as typeof Button;

const StandardFileUpload = (props: {
  field: StandardFileUploadProps;
  hideTitle?: boolean;
}) => {
  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();
  const { field: fieldConfig, hideTitle } = props;

  const [fileErrors, setFileErrors] = useState<Array<string>>([]);

  const maxSizeMb = useMemo(() => {
    return fieldConfig.maxSizeMb || 2;
  }, [fieldConfig.maxSizeMb]);

  const acceptTypes: string = useMemo(() => {
    if (isString(fieldConfig.acceptTypes)) {
      return fieldConfig.acceptTypes as string;
    }
    if (Array.isArray(fieldConfig.acceptTypes)) {
      return flattenDeep(fieldConfig.acceptTypes).join(",");
    }
    return fileTypes.join(",");
  }, [fieldConfig.acceptTypes]);

  const attachFiles = (files: FileList | null) => {
    if (!files || files.length < 1) {
      setFileErrors(["Nothing selected"]);
      return;
    }

    let input: { files: Array<File>; imageUrls: Array<string> } = {
      files: [],
      imageUrls: [],
    };
    let errors = [];
    for (const file of Array.from(files)) {
      if (file.size > maxSizeMb * 1024 * 1024) {
        errors.push(
          (file.name || "File") + " should be less than " + maxSizeMb + " MB"
        );
        continue;
      }
      input.files.push(file);

      if (fieldConfig.fileType === FileType.Image) {
        const url = URL.createObjectURL(file);
        input.imageUrls.push(url);
      }
    }

    // If not multiple, there should be only 1 file
    if (!fieldConfig.multiple) {
      input = {
        files: [input.files[0]],
        imageUrls: [input.imageUrls[0]],
      };
    }

    setValue(fieldConfig.attribute, input);
    setFileErrors(errors);
  };

  const componentProps = (
    fieldConfig: StandardFileUploadProps
  ): DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > => {
    return {
      id: fieldConfig.attribute,
      type: "file",
      hidden: true,
      multiple: false,
      accept: acceptTypes,
      onChange: (event) => attachFiles(event.target.files),
      ...fieldConfig.props,
    };
  };

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      render={({ field }) => (
        <Fragment>
          {!hideTitle && fieldConfig.title && <Title field={fieldConfig} />}
          <input {...componentProps(fieldConfig)} />
          <label
            htmlFor={componentProps(fieldConfig).id}
            onBlur={() => trigger(fieldConfig.attribute)}
          >
            {field.value?.files?.length > 0 ? (
              field.value.files.map((file: File, index: number) => (
                <StyledButtonBase component="div" key={index}>
                  {fieldConfig.fileType === FileType.Image &&
                    field.value.imageUrls?.length > 0 && (
                      <ImageContainerRoot fieldConfig={fieldConfig}>
                        <ImageSizer fieldConfig={fieldConfig} />
                        <ImageContainer>
                          <Image
                            src={field.value.imageUrls?.[index]}
                            alt={file.name}
                            loading="lazy"
                          />
                        </ImageContainer>
                      </ImageContainerRoot>
                    )}
                  <Input error={!!errors[fieldConfig.attribute]}>
                    {file.name || file}
                  </Input>
                </StyledButtonBase>
              ))
            ) : (
              <StyledButtonBase component="div">
                {fieldConfig.fileType === FileType.Image &&
                  fieldConfig.imageUrls?.[0] && (
                    <ImageContainerRoot fieldConfig={fieldConfig}>
                      <ImageSizer fieldConfig={fieldConfig} />
                      <ImageContainer>
                        <Image
                          src={fieldConfig.imageUrls[0]}
                          alt={fieldConfig.label}
                          loading="lazy"
                        />
                      </ImageContainer>
                    </ImageContainerRoot>
                  )}
                <Input
                  error={!!errors[fieldConfig.attribute]}
                  sx={{ color: "#777777" }}
                >
                  {fieldConfig.imageUrls?.[0] || fieldConfig.label}
                </Input>
              </StyledButtonBase>
            )}
          </label>
          {!!errors[fieldConfig.attribute] && (
            <ErrorText error={errors[fieldConfig.attribute]?.message} />
          )}
          {fileErrors?.length > 0 && <ErrorText error={fileErrors[0]} />}
        </Fragment>
      )}
    />
  );
};

export { StandardFileUpload };
