export interface ClassifyProps {
  activedClassify: number;
  customActivedClassify: (id: number) => void;
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

export interface TodoStateType {
  tableScrollH: number;
  todoListData: TodoMeta[];
  finishedListData: TodoMeta[];
  selectedFinishedRowsKeys: (string | number)[];
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
    };

interface RowSelectionType {
  onSelect: (record: TodoMeta) => void;
  selectedRowKeys: (string | number)[];
}

export interface TodoTableType {
  scrollH: number;
  tableData: TodoMeta[];
  rowSelection: RowSelectionType;
  loading: boolean;
}
