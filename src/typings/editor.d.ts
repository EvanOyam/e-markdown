type DefaultEditorProps = {
  withoutBorder: boolean;
  maxHeight: string;
};

export type EditorProps = {
  textValue?: string;
  mdPath?: string;
  handleChange: (text: string) => void;
} & Partial<DefaultEditorProps>;
