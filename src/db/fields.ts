import { FieldsType } from '../typings/database';

export const mdFields: FieldsType[] = [
  {
    name: 'title',
    type: 'TEXT',
    require: true,
  },
  {
    name: 'path',
    type: 'TEXT',
    require: true,
  },
  {
    name: 'classify',
    type: 'TEXT',
  },
  {
    name: 'type',
    type: 'TEXT',
  },
  {
    name: 'createdAt',
    type: 'INTEGER',
    require: true,
  },
  {
    name: 'updatedAt',
    type: 'INTEGER',
    require: true,
  },
];

export const mdClassifyFields: FieldsType[] = [
  {
    name: 'name',
    type: 'TEXT',
    require: true,
  },
  {
    name: 'type',
    type: 'TEXT',
    require: true,
  },
  {
    name: 'createdAt',
    type: 'INTEGER',
    require: true,
  },
  {
    name: 'updatedAt',
    type: 'INTEGER',
    require: true,
  },
];
