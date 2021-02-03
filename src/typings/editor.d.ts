type DefaultEditorProps = {
  withoutBorder: boolean;
  maxHeight: string;
};

export type EditorProps = {
  initValue: string;
} & Partial<DefaultEditorProps>;
