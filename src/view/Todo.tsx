import React, { useState } from 'react';
import Classify from '../components/todo/Classify';
import CustomDayPicker from '../components/todo/CustomDayPicker';
import { TodoWrapper, TodoMenu, TodoPanel } from '../style/todo.style';

export default function Todo() {
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [activedClassify, setActivedClassify] = useState(0);
  const customSelectDay = (day: Date) => {
    setSelectedDay(day);
    setActivedClassify(0);
  };
  const customActivedClassify = (id: number) => {
    setActivedClassify(id);
    setSelectedDay(undefined);
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
      <TodoPanel />
    </TodoWrapper>
  );
}
