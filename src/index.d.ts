declare module "@jeremyling/react-material-ui-rich-text-editor" {
  export interface EditorProps {
    html: string;
    updateHtml?: (html: string) => void;
    containerProps?: import("@mui/material").PaperProps;
    editableProps?: import("slate-react/dist/components/editable").EditableProps;
  }

  export const Editor: React.FunctionComponent<EditorProps>;
}
