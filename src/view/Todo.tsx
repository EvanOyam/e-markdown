import React, { useState } from 'react';
import Classify from '../components/todo/Classify';
import CustomDayPicker from '../components/todo/CustomDayPicker';
import TodoList from '../components/todo/TodoList';
import TodoToolsBar from '../components/todo/TodoToolsBar';
import { TodoWrapper, TodoMenu, TodoPanel } from '../style/todo.style';

export default function Todo() {
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [activedClassify, setActivedClassify] = useState(0);
  const customSelectDay = (day: Date) => {
    setActivedClassify(0);
    setSelectedDay(day);
  };
  const customActivedClassify = (id: number) => {
    setSelectedDay(undefined);
    setActivedClassify(id);
  };
  return (
    <TodoWrapper>
      <TodoMenu>
        <CustomDayPicker
          selectedDay={selectedDay}
          customSelectDay={customSelectDay}
        />
        <Classify
          activedClassify={activedClassify}
          customActivedClassify={customActivedClassify}
        />
      </TodoMenu>
      <TodoPanel>
        <TodoToolsBar title="今天" todoCount={3} />
        <TodoList />
      </TodoPanel>
    </TodoWrapper>
  );
}
