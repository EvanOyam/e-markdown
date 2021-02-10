export interface FieldsType {
  name: string;
  type: 'NULL' | 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB';
  require?: boolean;
  key?: boolean;
}

export interface MdType {
  id: string; // md id
  title: string; // 标题
  mdpath: string; // 文件路径
  classify?: string; // 分类
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
}

export interface MdClassifyType {
  id: string; // 分类 id
  name: string; // 名称
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
