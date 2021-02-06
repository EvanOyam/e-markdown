import React, { useState } from 'react';
import styled from '@emotion/styled';
import CustomDayPicker from './CustomDayPicker';
import Classify from './Classify';

const TodoMenuWrapper = styled.div`
  background-color: #2e2e2e;
`;

export default function TodoMenu() {
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
    <TodoMenuWrapper>
      <CustomDayPicker
        selectedDay={selectedDay}
        customSelectDay={customSelectDay}
      />
      <Classify
        activedClassify={activedClassify}
        customActivedClassify={customActivedClassify}
      />
    </TodoMenuWrapper>
  );
}
