import React, { useReducer } from 'react';
import styled from '@emotion/styled';
import TodoMenu from './TodoMenu';
import TodoPanel from './TodoPanel';
import { TodoContextProvider, reducer } from '../../context/todoContext';
import { TodoMeta } from '../../typings/todo';

const TodoWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export default function Todo() {
  const [state, dispatch] = useReducer(reducer, {
    tableScrollH: 0,
    todoListData: [] as TodoMeta[],
    finishedListData: [] as TodoMeta[],
    selectedFinishedRowsKeys: [] as (string | number)[],
  });

  return (
    <TodoContextProvider value={{ state, dispatch }}>
      <TodoWrapper>
        <TodoMenu />
        <TodoPanel />
      </TodoWrapper>
    </TodoContextProvider>
  );
}
