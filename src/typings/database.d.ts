export interface FieldsType {
  name: string;
  type: 'NULL' | 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB';
  require?: boolean;
  key?: boolean;
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

export interface TodoType {
  id: string; // id
  title: string; // 标题
  dateTimestamp: number; // 任务日期时间戳
  date: string; // 任务日期
  status: TodoMetaStatus; // 任务状态
  classify: TodoClassify; // 分类
  path: string; // md 路径
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
}

export interface MdType {
  id: string; // md id
  title: string; // 标题
  mdpath: string; // 文件路径
  classify?: string; // 分类
  type: 'markdown' | 'mindmap'; // md 的类型
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
}

export interface MdClassifyType {
  id: string; // 分类 id
  name: string; // 名称
  type: 'markdown' | 'mindmap'; // md 的类型
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
}

interface MenuMdType {
  key: string;
  title: string;
}

export interface MenuClassifyType {
  title: string;
  key: string;
  children: MenuMdType[];
}
