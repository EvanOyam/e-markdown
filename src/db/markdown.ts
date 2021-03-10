import * as fs from 'fs';
import * as path from 'path';
import moment from 'moment';
import {
  MdClassifyType,
  MdType,
  MenuClassifyType,
  MenuMdType,
  TodoType,
} from '../typings/database';

export const createTodo = async (db: any, params: TodoType) => {
  try {
    const {
      id,
      title,
      dateTimestamp,
      date,
      status,
      classify,
      path: mdPath,
      createdAt,
      updatedAt,
    } = params;
    db.run(
      'INSERT INTO todo VALUES (:id, :title, :dateTimestamp, :date, :status, :classify, :path, :createdAt, :updatedAt);',
      {
        ':id': id,
        ':title': title,
        ':dateTimestamp': dateTimestamp,
        ':date': date,
        ':status': status,
        ':classify': classify || '',
        ':path': mdPath,
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
    console.log('IPC "createTodo" error: ', error);
  }
};

export const deleteTodo = async (db: any, id: string) => {
  try {
    db.run(`DELETE FROM todo WHERE id='${id}'`);
    const data = db.export();
    const buffer = Buffer.from(data);
    await fs.promises.writeFile(
      path.join(__dirname, '..', '..', 'assets', 'data', 'database.sqlite'),
      buffer
    );
  } catch (error) {
    console.log('IPC "deleteTodo" error: ', error);
  }
};

export const updateTodo = async (
  db: any,
  id: string,
  params: Partial<TodoType>
) => {
  try {
    const { title, dateTimestamp, status, classify } = params;
    const updateFields = {
      title,
      dateTimestamp,
      date: dateTimestamp
        ? moment(dateTimestamp).format('YYYY-MM-DD')
        : undefined,
      status,
      classify,
      updatedAt: +new Date(),
    } as any;
    let queryStr = '';
    for (const key in updateFields) {
      if (Object.prototype.hasOwnProperty.call(updateFields, key)) {
        if (updateFields[key] || key === 'status') {
          queryStr += `${key}='${updateFields[key]}', `;
        }
      }
    }
    queryStr = queryStr.substr(0, queryStr.length - 2);

    db.run(`UPDATE todo SET ${queryStr} WHERE id='${id}'`);
    const data = db.export();
    const buffer = Buffer.from(data);
    await fs.promises.writeFile(
      path.join(__dirname, '..', '..', 'assets', 'data', 'database.sqlite'),
      buffer
    );
  } catch (error) {
    console.log('IPC "updateTodo" error: ', error);
  }
};

export const countTodo = async (db: any) => {
  try {
    const res = db.exec(`
    SELECT
    sum(CASE WHEN classify='1' AND status='0' THEN 1 ELSE 0 END) 备忘录,
    sum(CASE WHEN classify='2' AND status='0' THEN 1 ELSE 0 END) 工作,
    sum(CASE WHEN classify='3' AND status='0' THEN 1 ELSE 0 END) 学习,
    sum(CASE WHEN classify='4' AND status='0' THEN 1 ELSE 0 END) 其他
    FROM todo
    `);
    return res[0].values[0];
  } catch (error) {
    console.log('IPC "countTodo" error: ', error);
  }
};

export const searchTodo = async (db: any, title: string, status: number) => {
  try {
    let searchString = title
      .split('')
      .map((str) => `title LIKE '%${str}%' AND `)
      .join('');
    searchString = searchString.substr(0, searchString.length - 5);
    const stmt = db.prepare(
      `SELECT * FROM todo WHERE ${searchString} AND status='${status}'`
    );
    const res = [];
    while (stmt.step()) {
      res.push(stmt.getAsObject());
    }
    return res;
  } catch (error) {
    console.log('IPC "searchTodo" error: ', error);
  }
};

export const getTodoList = (db: any, fileds?: string[], query?: any) => {
  const filedsStr = fileds && fileds.length !== 0 ? fileds.join(', ') : '*';
  let queryStr = '';
  if (query) {
    for (const key in query) {
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        queryStr += `${key}='${query[key]}' AND `;
      }
    }
    queryStr = queryStr.substr(0, queryStr.length - 5);
  }
  const sql = queryStr
    ? `SELECT ${filedsStr} FROM todo WHERE ${queryStr}`
    : `SELECT ${filedsStr} FROM todo`;
  try {
    const stmt = db.prepare(sql);
    const res = [];
    while (stmt.step()) {
      res.push(stmt.getAsObject());
    }
    return res;
  } catch (error) {
    console.log('IPC "getTodoList" error: ', error);
  }
};

export const getTodoDays = (db: any, year: number, month: number) => {
  const startTime = moment([year, month - 1, 1])
    .add(-1, 'w')
    .valueOf();
  const endTime = moment(startTime).add(6, 'w').valueOf();
  const sql = `SELECT dateTimestamp FROM todo WHERE dateTimestamp > ${startTime} AND dateTimestamp < ${endTime}`;
  try {
    const stmt = db.prepare(sql);
    const res = [];
    while (stmt.step()) {
      res.push(stmt.getAsObject());
    }
    return res;
  } catch (error) {
    console.log('IPC "getTodoDays" error: ', error);
  }
};

export const createMd = async (db: any, params: MdType) => {
  try {
    const { id, title, mdpath, classify, type, createdAt, updatedAt } = params;
    db.run(
      'INSERT INTO markdown VALUES (:id, :title, :path, :classify, :type, :createdAt, :updatedAt);',
      {
        ':id': id,
        ':title': title,
        ':path': mdpath,
        ':classify': classify || '',
        ':type': type,
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
    const { id, name, type, createdAt, updatedAt } = params;
    db.run(
      'INSERT INTO markdownClassify VALUES (:id, :name, :type, :createdAt, :updatedAt);',
      {
        ':id': id,
        ':name': name,
        ':type': type,
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

export const getMdClassify = (db: any, type: 'markdown' | 'mindmap') => {
  try {
    const stmt = db.prepare(
      `SELECT id, name FROM markdownClassify WHERE type='${type}'`
    );
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
    console.log('IPC "renameMdClassify" error: ', error);
  }
};
