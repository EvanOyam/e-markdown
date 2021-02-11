type DefaultEditorProps = {
  withoutBorder: boolean;
  maxHeight: string;
};

export type EditorProps = {
  textValue?: string;
  handleSave: (text: string) => void;
  handleChange: (text: string) => void;
} & Partial<DefaultEditorProps>;
