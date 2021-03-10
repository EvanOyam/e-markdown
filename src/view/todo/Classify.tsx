import React, { useContext, useEffect } from 'react';
import { List, Badge } from 'antd';
import {
  TagsTwoTone,
  CodeTwoTone,
  EditTwoTone,
  ProfileTwoTone,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';
import { ClassifyList, ClassifyType } from '../../typings/todo';
import { TodoContext } from '../../context/todoContext';

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

// todo feat: 改为数据库后加上提醒数字
export default function Classify() {
  const { state, dispatch } = useContext(TodoContext);

  useEffect(() => {
    (async () => {
      const classifyCount = await ipcRenderer.invoke('countTodo');
      dispatch({ type: 'setClassifyCount', value: classifyCount });
    })();
  }, []);

  const handleChangeClassify = (id: ClassifyType) => {
    dispatch({
      type: 'changeDateOrClassify',
      value: { type: 'classify', value: id },
    });
  };

  return (
    <ClassifyWrapper>
      <List
        itemLayout="horizontal"
        dataSource={classifyList}
        split={false}
        renderItem={(item, index) => (
          <List.Item
            className={
              state.actived.type === 'classify' &&
              state.actived.value === item.id
                ? 'ant-list-item-actived'
                : ''
            }
            onClick={() => handleChangeClassify(item.id)}
            extra={
              <Badge
                style={{ backgroundColor: '#ff6767' }}
                count={state.classifyCount[index]}
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
