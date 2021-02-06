import React from 'react';
import { List, Badge } from 'antd';
import {
  CarryOutTwoTone,
  TagsTwoTone,
  CodeTwoTone,
  EditTwoTone,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { ClassifyProps } from '../../typings/todo';

const ClassifyWrapper = styled.div`
  padding: 16px;
  overflow: hidden;
  border-top: 1px solid rgba(255, 253, 238, 0.1);
`;

const tagList = [
  {
    id: 1,
    icon: (
      <CarryOutTwoTone twoToneColor="#4cb182" style={{ fontSize: '20px' }} />
    ),
    title: '今天',
    todoNum: 3,
  },
  {
    id: 2,
    icon: <TagsTwoTone twoToneColor="#ceaf67" style={{ fontSize: '20px' }} />,
    title: '备忘录',
    todoNum: 0,
  },
  {
    id: 3,
    icon: <CodeTwoTone twoToneColor="#634cb1" style={{ fontSize: '20px' }} />,
    title: '工作',
    todoNum: 0,
  },
  {
    id: 4,
    icon: <EditTwoTone twoToneColor="#4c89b1" style={{ fontSize: '20px' }} />,
    title: '学习',
    todoNum: 0,
  },
];

export default function Classify(props: ClassifyProps) {
  const { activedClassify, customActivedClassify } = props;
  return (
    <ClassifyWrapper>
      <List
        itemLayout="horizontal"
        dataSource={tagList}
        split={false}
        renderItem={(item) => (
          <List.Item
            className={
              activedClassify === item.id ? 'ant-list-item-actived' : ''
            }
            onClick={() => customActivedClassify(item.id)}
            extra={<Badge count={item.todoNum} />}
          >
            <List.Item.Meta avatar={item.icon} title={item.title} />
          </List.Item>
        )}
      />
    </ClassifyWrapper>
  );
}
