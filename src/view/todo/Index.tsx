import React, { useReducer } from 'react';
import styled from '@emotion/styled';
import moment from 'moment';
import TodoMenu from './TodoMenu';
import TodoPanel from './TodoPanel';
import { TodoContextProvider, reducer } from '../../context/todoContext';
import { TodoType } from '../../typings/database';

const TodoWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export default function Todo() {
  const [state, dispatch] = useReducer(reducer, {
    tableScrollH: 0,
    todoListData: [] as TodoType[],
    finishedListData: [] as TodoType[],
    selectedFinishedRowsKeys: [] as (string | number)[],
    actived: {
      type: 'date',
      value: moment().format('YYYY-MM-DD'),
    },
    todoDays: [],
    currentMonth: moment().valueOf(),
    classifyCount: [],
    headerTitle: '',
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
