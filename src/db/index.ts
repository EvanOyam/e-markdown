import fs from 'fs';
import path from 'path';
import { FieldsType } from '../typings/database';
import { mdFields, mdClassifyFields, todoFields } from './fields';

const initSqlJs = require('sql.js/dist/sql-asm');

const handleDBPath = async (dbName: string) => {
  const dirPath = path.join(__dirname, '..', '..', 'assets', 'data');
  const hasDir = await fs.existsSync(dirPath);
  if (!hasDir) await fs.promises.mkdir(dirPath, { recursive: true });
  return path.join(dirPath, `${dbName}.sqlite`);
};

export const createDB = async (SQL: any, dbPath: string) => {
  try {
    const db = new SQL.Database();
    const data = db.export();
    const buffer = Buffer.from(data);
    await fs.promises.writeFile(dbPath, buffer);
  } catch (error) {
    console.log('Create database error: ', error);
  }
};

export const createTable = (db: any, table: string, fields: FieldsType[]) => {
  try {
    const fieldsStr = fields
      .map(
        (field) =>
          `${field.name} ${field.type}${field.key ? ' PRIMARY KEY' : ''}${
            field.require ? ' NOT NULL' : ''
          }`
      )
      .join(', ');
    db.run(
      `CREATE TABLE IF NOT EXISTS ${table} (id INT PRIMARY KEY NOT NULL, ${fieldsStr});`
    );
  } catch (error) {
    console.log('Create table error: ', error);
  }
};

export const initDB = async () => {
  try {
    const SQL = await initSqlJs({});
    const dbPath = await handleDBPath('database');
    const hasDB = fs.existsSync(dbPath);
    if (!hasDB) await createDB(SQL, dbPath);
    const dbFileBuffer = await fs.promises.readFile(dbPath);
    const db = new SQL.Database(dbFileBuffer);
    createTable(db, 'todo', todoFields);
    createTable(db, 'markdown', mdFields);
    createTable(db, 'markdownClassify', mdClassifyFields);
    return db;
  } catch (error) {
    console.log('Init database error: ', error);
  }
};
