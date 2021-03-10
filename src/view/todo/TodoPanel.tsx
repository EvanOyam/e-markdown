import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import useDeepCompareEffect from 'use-deep-compare-effect';
import TodoList from './TodoList';
import TodoToolsBar from './TodoToolsBar';
import { TodoContext } from '../../context/todoContext';

const TodoPanelWrapper = styled.div`
  flex: 1;
  background-color: #272b31;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

enum TodoClassify {
  '备忘录' = 1,
  '工作',
  '学习',
  '其他',
}

export default function TodoPanel() {
  const { state, dispatch } = useContext(TodoContext);
  // todo feat: 加入当日代办任务数
  useDeepCompareEffect(() => {
    const { type, value } = state.actived;
    if (type === 'date') {
      dispatch({ type: 'setHeaderTitle', value: value.toString() });
    } else if (type === 'classify') {
      dispatch({
        type: 'setHeaderTitle',
        value: TodoClassify[value as number],
      });
    }
  }, [state.actived]);
  return (
    <TodoPanelWrapper>
      <TodoToolsBar />
      <TodoList actived={state.actived} />
    </TodoPanelWrapper>
  );
}
