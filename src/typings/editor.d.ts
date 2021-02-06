type DefaultEditorProps = {
  withoutBorder: boolean;
  maxHeight: string;
};

export type EditorProps = {
  textValue: string;
  handleChange: (text: string) => void;
} & Partial<DefaultEditorProps>;
