import { ReactElement } from 'react';
import { TodoType } from './database';

type ClassifyType = 1 | 2 | 3 | 4;

type ActivedTodoType =
  | {
      type: 'date';
      value: string;
    }
  | {
      type: 'classify';
      value: ClassifyType;
    }
  | {
      type: '';
      value: '';
    };

export interface TodoStateType {
  tableScrollH: number;
  todoListData: TodoType[];
  finishedListData: TodoType[];
  selectedFinishedRowsKeys: (string | number)[];
  actived: ActivedTodoType;
  todoDays: string[];
  currentMonth: number;
  classifyCount: number[];
  headerTitle: string;
}

export type TodoActionType =
  | {
      type: 'setTableScrollH';
      value: number;
    }
  | {
      type: 'setTodoListData';
      value: TodoType[];
    }
  | {
      type: 'setFinishedListData';
      value: TodoType[];
    }
  | {
      type: 'setSelectedFinishedRowsKeys';
      value: (string | number)[];
    }
  | {
      type: 'changeDateOrClassify';
      value: ActivedTodoType;
    }
  | {
      type: 'setTodoDays';
      value: string[];
    }
  | {
      type: 'setCurrentMonth';
      value: number;
    }
  | {
      type: 'setClassifyCount';
      value: number[];
    }
  | {
      type: 'setHeaderTitle';
      value: string;
    };

interface RowSelectionType {
  onSelect: (record: TodoType) => void;
  selectedRowKeys: (string | number)[];
}

export interface TodoTableType {
  tableData: TodoType[];
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

export interface TodoDetailProps {
  todoId: string;
}
