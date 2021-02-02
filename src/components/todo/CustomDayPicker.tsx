import React, { useEffect, useState } from 'react';
import DayPicker from 'react-day-picker';
import { Badge } from 'antd';
import { DayPickerLayout, DayStyle } from '../../style/todo.style';
import { CustomDayPickerProps } from '../../typings/todo';

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
      <DayStyle>
        {date}
        {todoDays.includes(+new Date(day)) && (
          <Badge className="ant-badge-status-day" status="warning" />
        )}
      </DayStyle>
    );
  };

  return (
    <DayPickerLayout>
      <DayPicker
        showOutsideDays
        onDayClick={handleDayClick}
        selectedDays={selectedDay}
        renderDay={renderDay}
      />
    </DayPickerLayout>
  );
}
