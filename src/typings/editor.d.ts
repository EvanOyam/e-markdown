type ToolbarButton =
  | 'bold'
  | 'italic'
  | 'quote'
  | 'unordered-list'
  | 'ordered-list'
  | 'link'
  | 'image'
  | 'strikethrough'
  | 'code'
  | 'table'
  | 'redo'
  | 'heading'
  | 'undo'
  | 'heading-bigger'
  | 'heading-smaller'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'clean-block'
  | 'horizontal-rule'
  | 'preview'
  | 'side-by-side'
  | 'fullscreen'
  | 'guide';

type DefaultEditorProps = {
  withoutBorder: boolean;
  maxHeight: string;
};

export type EditorProps = {
  textValue?: string;
  mindmap?: boolean;
  handleSave: (text: string) => void;
  handleMap?: () => void;
  handleChange: (text: string) => void;
} & Partial<DefaultEditorProps>;
