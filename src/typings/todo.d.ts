import { ReactElement } from 'react';

type ClassifyType = 1 | 2 | 3 | 4;

export interface ClassifyProps {
  activedClassify: number;
  setActivedClassify: (id: ClassifyType) => void;
}

export interface CustomDayPickerProps {
  selectedDay: Date | undefined;
  customSelectDay: (day: Date) => void;
}

// 0: 未完成 | 1: 完成
type TodoMetaStatus = 0 | 1;

// 标签枚举
declare enum TodoClassify {
  memo = 1,
  work,
  study,
  other,
}

export interface TodoMeta {
  id: string;
  title: string;
  date: number;
  status: TodoMetaStatus;
  alarmDate: number;
  classify: TodoClassify;
  path: string;
  createdAt: number;
}

export interface TodoToolsBarProps {
  title: string;
  todoCount: number;
}

type ActivedTodoType =
  | {
      type: 'date';
      value: string;
    }
  | {
      type: 'classify';
      value: ClassifyType;
    };

export interface TodoStateType {
  tableScrollH: number;
  todoListData: TodoMeta[];
  finishedListData: TodoMeta[];
  selectedFinishedRowsKeys: (string | number)[];
  actived: ActivedTodoType;
}

export type TodoActionType =
  | {
      type: 'setTableScrollH';
      value: number;
    }
  | {
      type: 'setTodoListData';
      value: TodoMeta[];
    }
  | {
      type: 'setFinishedListData';
      value: TodoMeta[];
    }
  | {
      type: 'setSelectedFinishedRowsKeys';
      value: (string | number)[];
    }
  | {
      type: 'changeDateOrClassify';
      value: ActivedTodoType;
    };

interface RowSelectionType {
  onSelect: (record: TodoMeta) => void;
  selectedRowKeys: (string | number)[];
}

export interface TodoTableType {
  tableData: TodoMeta[];
  rowSelection: RowSelectionType;
}

export interface TodoListProps {
  actived: ActivedTodoType;
}

export interface ClassifyList {
  id: ClassifyType;
  icon: ReactElement;
  title: string;
}
