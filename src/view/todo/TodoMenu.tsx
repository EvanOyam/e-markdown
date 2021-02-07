import React, { useState, useContext } from 'react';
import styled from '@emotion/styled';
import moment from 'moment';
import CustomDayPicker from './CustomDayPicker';
import Classify from './Classify';
import { TodoContext } from '../../context/todoContext';
import { ClassifyType } from '../../typings/todo';

const TodoMenuWrapper = styled.div`
  background-color: #2e2e2e;
`;

export default function TodoMenu() {
  const { dispatch } = useContext(TodoContext);
  const [selectedDay, setSelectedDay] = useState<Date>();
  const [activedClassify, setActivedClassify] = useState(0);
  const customSelectDay = (day: Date) => {
    setActivedClassify(0);
    setSelectedDay(day);
    dispatch({
      type: 'changeDateOrClassify',
      value: { type: 'date', value: moment(day).format('YYYY-MM-DD') },
    });
  };
  const handleSetActivedClassify = (id: ClassifyType) => {
    setSelectedDay(undefined);
    setActivedClassify(id);
    dispatch({
      type: 'changeDateOrClassify',
      value: { type: 'classify', value: id },
    });
  };
  return (
    <TodoMenuWrapper>
      <CustomDayPicker
        selectedDay={selectedDay}
        customSelectDay={customSelectDay}
      />
      <Classify
        activedClassify={activedClassify}
        setActivedClassify={handleSetActivedClassify}
      />
    </TodoMenuWrapper>
  );
}
