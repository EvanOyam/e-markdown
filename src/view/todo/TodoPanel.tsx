import React from 'react';
import styled from '@emotion/styled';
import TodoList from './TodoList';
import TodoToolsBar from './TodoToolsBar';

const TodoPanelWrapper = styled.div`
  flex: 1;
  background-color: #272b31;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export default function TodoPanel() {
  return (
    <TodoPanelWrapper>
      <TodoToolsBar title="今天" todoCount={3} />
      <TodoList />
    </TodoPanelWrapper>
  );
}
