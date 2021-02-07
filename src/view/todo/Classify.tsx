import React, { useState, useEffect } from 'react';
import { List, Badge } from 'antd';
import {
  TagsTwoTone,
  CodeTwoTone,
  EditTwoTone,
  ProfileTwoTone,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';
import { ClassifyList, ClassifyProps, ClassifyType } from '../../typings/todo';

const ClassifyWrapper = styled.div`
  padding: 16px;
  overflow: hidden;
  border-top: 1px solid rgba(255, 253, 238, 0.1);
`;

const classifyList: ClassifyList[] = [
  {
    id: 1,
    icon: <TagsTwoTone twoToneColor="#4cb182" style={{ fontSize: '20px' }} />,
    title: '备忘录',
  },
  {
    id: 2,
    icon: <CodeTwoTone twoToneColor="#634cb1" style={{ fontSize: '20px' }} />,
    title: '工作',
  },
  {
    id: 3,
    icon: <EditTwoTone twoToneColor="#4c89b1" style={{ fontSize: '20px' }} />,
    title: '学习',
  },
  {
    id: 4,
    icon: (
      <ProfileTwoTone twoToneColor="#cf4e81" style={{ fontSize: '20px' }} />
    ),
    title: '其他',
  },
];

export default function Classify(props: ClassifyProps) {
  const { activedClassify, setActivedClassify } = props;
  const [todoNum, setTodoNum] = useState([] as number[]);

  useEffect(() => {
    (async () => {
      const classifyIndexPromise = [];
      for await (const classify of classifyList) {
        classifyIndexPromise.push(
          ipcRenderer.invoke(
            'getStoreValue',
            `todo.classifyIndex.${classify.id}`
          )
        );
      }
      // todo feat: 改成 db 后，提醒数应该是未完成而非全部的
      const classifyIndex = await Promise.all(classifyIndexPromise);
      const todoNumList = classifyIndex.map((item) => (item ? item.length : 0));
      setTodoNum(todoNumList);
    })();
  }, []);

  return (
    <ClassifyWrapper>
      <List
        itemLayout="horizontal"
        dataSource={classifyList}
        split={false}
        renderItem={(item, index) => (
          <List.Item
            className={
              activedClassify === item.id ? 'ant-list-item-actived' : ''
            }
            onClick={() => setActivedClassify(item.id)}
            extra={
              <Badge
                style={{ backgroundColor: '#5aabda' }}
                count={todoNum[index]}
              />
            }
          >
            <List.Item.Meta avatar={item.icon} title={item.title} />
          </List.Item>
        )}
      />
    </ClassifyWrapper>
  );
}
