import React, { useState } from 'react';
import Classify from './Classify';
import CustomDayPicker from './CustomDayPicker';
import TodoList from './TodoList';
import TodoToolsBar from './TodoToolsBar';
import { TodoWrapper, TodoMenu, TodoPanel } from './todo.style';

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
