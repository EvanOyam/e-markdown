import * as fs from 'fs';
import * as path from 'path';
import {
  MdClassifyType,
  MdType,
  MenuClassifyType,
  MenuMdType,
} from '../typings/database';

export const createMd = async (db: any, params: MdType) => {
  try {
    const { id, title, mdpath, classify, createdAt, updatedAt } = params;
    db.run(
      'INSERT INTO markdown VALUES (:id, :title, :path, :classify, :createdAt, :updatedAt);',
      {
        ':id': id,
        ':title': title,
        ':path': mdpath,
        ':classify': classify || '',
        ':createdAt': createdAt,
        ':updatedAt': updatedAt,
      }
    );
    const data = db.export();
    const buffer = Buffer.from(data);
    await fs.promises.writeFile(
      path.join(__dirname, '..', '..', 'assets', 'data', 'database.sqlite'),
      buffer
    );
  } catch (error) {
    console.log('IPC "createMd" error: ', error);
  }
};

export const deleteMd = async (db: any, id: string) => {
  try {
    db.run(`DELETE FROM markdown WHERE id='${id}'`);
    const data = db.export();
    const buffer = Buffer.from(data);
    await fs.promises.writeFile(
      path.join(__dirname, '..', '..', 'assets', 'data', 'database.sqlite'),
      buffer
    );
  } catch (error) {
    console.log('IPC "deleteMd" error: ', error);
  }
};

export const renameMd = async (db: any, params: Partial<MdType>) => {
  const { title, id } = params;
  try {
    db.run(`UPDATE markdown SET title='${title}' WHERE id='${id}'`);
    const data = db.export();
    const buffer = Buffer.from(data);
    await fs.promises.writeFile(
      path.join(__dirname, '..', '..', 'assets', 'data', 'database.sqlite'),
      buffer
    );
  } catch (error) {
    console.log('IPC "renameMd" error: ', error);
  }
};

export const getMdList = (db: any, fileds?: string[], query?: any) => {
  const filedsStr = fileds && fileds.length !== 0 ? fileds.join(', ') : '*';
  let queryStr = '';
  if (query) {
    for (const key in query) {
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        queryStr += `${key}=${query[key]} AND `;
      }
    }
    queryStr = queryStr.substr(0, queryStr.length - 5);
  }
  const sql = queryStr
    ? `SELECT ${filedsStr} FROM markdown WHERE ${queryStr}`
    : `SELECT ${filedsStr} FROM markdown`;
  try {
    const stmt = db.prepare(sql);
    const res = [];
    while (stmt.step()) {
      res.push(stmt.getAsObject());
    }
    return res;
  } catch (error) {
    console.log('IPC "getMdList" error: ', error);
  }
};

export const createMdClassify = async (db: any, params: MdClassifyType) => {
  try {
    const { id, name, createdAt, updatedAt } = params;
    db.run(
      'INSERT INTO markdownClassify VALUES (:id, :name, :createdAt, :updatedAt);',
      {
        ':id': id,
        ':name': name,
        ':createdAt': createdAt,
        ':updatedAt': updatedAt,
      }
    );
    const data = db.export();
    const buffer = Buffer.from(data);
    await fs.promises.writeFile(
      path.join(__dirname, '..', '..', 'assets', 'data', 'database.sqlite'),
      buffer
    );
  } catch (error) {
    console.log('IPC "createMdClassify" error: ', error);
  }
};

export const deleteMdClassify = async (db: any, id: string) => {
  try {
    db.run(`DELETE FROM markdownClassify WHERE id='${id}'`);
    const data = db.export();
    const buffer = Buffer.from(data);
    await fs.promises.writeFile(
      path.join(__dirname, '..', '..', 'assets', 'data', 'database.sqlite'),
      buffer
    );
  } catch (error) {
    console.log('IPC "deleteMdClassify" error: ', error);
  }
};

export const getMdClassify = (db: any) => {
  try {
    const stmt = db.prepare('SELECT id, name FROM markdownClassify');
    const classifyList: MenuClassifyType[] = [];
    while (stmt.step()) {
      const { id, name } = stmt.getAsObject();
      const classify = {
        title: name,
        key: id,
        children: [] as MenuMdType[],
      };
      classifyList.push(classify);
    }
    const mdList = getMdList(db) || [];
    return classifyList.map((classify) => {
      const children = mdList
        .filter((md) => md.classify === classify.key)
        .map((md) => {
          return {
            title: md.title,
            key: md.id,
            isLeaf: true,
          };
        });
      return {
        ...classify,
        children,
      };
    });
  } catch (error) {
    console.log('IPC "getMdClassify" error: ', error);
  }
};

export const renameMdClassify = async (
  db: any,
  params: Partial<MdClassifyType>
) => {
  const { name, id } = params;
  try {
    db.run(`UPDATE markdownClassify SET name='${name}' WHERE id='${id}'`);
    const data = db.export();
    const buffer = Buffer.from(data);
    await fs.promises.writeFile(
      path.join(__dirname, '..', '..', 'assets', 'data', 'database.sqlite'),
      buffer
    );
  } catch (error) {
    console.log('IPC "renameMd" error: ', error);
  }
};
