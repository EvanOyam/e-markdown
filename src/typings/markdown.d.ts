import { Dispatch } from 'react';

export type TreeKey = string | number;

export interface TreeMeta<T> {
  key: TreeKey;
  title: T;
}

export interface TreeDataType<T> extends TreeMeta<T> {
  isLeaf?: boolean;
  children?: TreeMeta<T>[];
}

export interface MdStateType {
  openMdId: string;
}

export type MdActionType = {
  type: 'setOpenMdId';
  value: string;
};

export interface MdContextType {
  state: MdStateType;
  dispatch: Dispatch<MdActionType>;
}
