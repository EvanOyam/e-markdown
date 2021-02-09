import * as fs from 'fs';
import * as path from 'path';
import { MdClassifyType, MdType } from '../typings/database';

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

export const getMdList = (db: any) => {
  try {
    const stmt = db.prepare('SELECT * FROM markdown');
    const res = [];
    while (stmt.step()) {
      res.push(stmt.get());
    }
    return res;
  } catch (error) {
    console.log('IPC "getMdList" error: ', error);
  }
};

export const createMdClassify = async (db: any, params: MdClassifyType) => {
  try {
    const { id, parentId, name, createdAt, updatedAt } = params;
    db.run(
      'INSERT INTO markdownClassify VALUES (:id, :parentId, :name, :createdAt, :updatedAt);',
      {
        ':id': id,
        ':parentId': parentId,
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

export const getMdClassify = (db: any) => {
  try {
    const stmt = db.prepare('SELECT * FROM markdownClassify');
    const res = [];
    while (stmt.step()) {
      res.push(stmt.get());
    }
    return res;
  } catch (error) {
    console.log('IPC "getMdClassify" error: ', error);
  }
};
