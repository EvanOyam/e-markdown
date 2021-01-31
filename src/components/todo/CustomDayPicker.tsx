import React from 'react';
import DayPicker from 'react-day-picker';
import { DayPickerLayout } from '../../style/todo.style';
import { CustomDayPickerProps } from '../../typings/todo';

export default function CustomDayPicker(props: CustomDayPickerProps) {
  const { selectedDay, customSelectDay } = props;
  const handleDayClick = (day: Date) => {
    customSelectDay(day);
  };
  return (
    <DayPickerLayout>
      <DayPicker
        showOutsideDays
        onDayClick={handleDayClick}
        selectedDays={selectedDay}
      />
    </DayPickerLayout>
  );
}
