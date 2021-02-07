import React, { useContext } from 'react';
import styled from '@emotion/styled';
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

export default function TodoPanel() {
  const { state } = useContext(TodoContext);
  return (
    <TodoPanelWrapper>
      <TodoToolsBar title="今天" todoCount={3} />
      <TodoList actived={state.actived} />
    </TodoPanelWrapper>
  );
}
