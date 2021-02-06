import React, { useEffect, useState } from 'react';
import DayPicker from 'react-day-picker';
import { Badge } from 'antd';
import styled from '@emotion/styled';
import { CustomDayPickerProps } from '../../typings/todo';

const DayPickerWrapper = styled.div`
  height: 360px;
`;

const DayWrapper = styled.div`
  position: relative;
`;

export default function CustomDayPicker(props: CustomDayPickerProps) {
  const { selectedDay, customSelectDay } = props;
  const [todoDays, setTodoDays] = useState([] as number[]);
  useEffect(() => {
    setTodoDays([1612152000000, 1612756800000, 1613534400000]);
  }, []);

  const handleDayClick = (day: Date) => {
    customSelectDay(day);
  };

  const renderDay = (day: Date) => {
    const date = day.getDate();
    return (
      <DayWrapper>
        {date}
        {todoDays.includes(+new Date(day)) && (
          <Badge className="ant-badge-status-day" status="warning" />
        )}
      </DayWrapper>
    );
  };

  return (
    <DayPickerWrapper>
      <DayPicker
        showOutsideDays
        onDayClick={handleDayClick}
        selectedDays={selectedDay}
        renderDay={renderDay}
      />
    </DayPickerWrapper>
  );
}
