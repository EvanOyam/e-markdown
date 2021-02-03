export type TreeKey = string | number;

export interface TreeMeta<T> {
  key: TreeKey;
  title: T;
}

export interface TreeDataType<T> extends TreeMeta<T> {
  isLeaf?: boolean;
  children?: TreeMeta<T>[];
}
