import React, { useEffect, useState } from 'react';
import DayPicker from 'react-day-picker';
import { Badge } from 'antd';
import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';
import moment from 'moment';
import { CustomDayPickerProps } from '../../typings/todo';

const DayPickerWrapper = styled.div`
  height: 360px;
`;

const DayWrapper = styled.div`
  position: relative;
`;

export default function CustomDayPicker(props: CustomDayPickerProps) {
  const { selectedDay, customSelectDay } = props;
  const [todoDays, setTodoDays] = useState([] as string[]);
  useEffect(() => {
    (async () => {
      try {
        const dateIndex = await ipcRenderer.invoke(
          'getStoreValue',
          `todo.dateIndex`
        );
        const dateArr = [];
        for (const date in dateIndex) {
          if (Object.prototype.hasOwnProperty.call(dateIndex, date)) {
            dateArr.push(date);
          }
        }
        setTodoDays(dateArr);
      } catch (error) {
        console.log('Initialization day picker error: ', error);
      }
    })();
  }, []);

  const handleDayClick = (day: Date) => {
    customSelectDay(day);
  };

  const renderDay = (day: Date) => {
    const date = day.getDate();
    return (
      <DayWrapper>
        {date}
        {todoDays.includes(moment(day).format('YYYY-MM-DD')) && (
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
