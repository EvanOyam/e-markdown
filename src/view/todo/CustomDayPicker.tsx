import React, { useEffect, useState, useContext } from 'react';
import DayPicker from 'react-day-picker';
import { Badge } from 'antd';
import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';
import moment from 'moment';
import { TodoType } from '../../typings/database';
import { TodoContext } from '../../context/todoContext';

const DayPickerWrapper = styled.div`
  height: 360px;
`;

const DayWrapper = styled.div`
  position: relative;
`;

export default function CustomDayPicker() {
  const { state, dispatch } = useContext(TodoContext);

  // 默认选中当日
  useEffect(() => {
    dispatch({
      type: 'changeDateOrClassify',
      value: { type: 'date', value: moment().format('YYYY-MM-DD') },
    });
  }, []);

  // 更新日历标记点状态
  useEffect(() => {
    (async () => {
      try {
        let todoDate = await ipcRenderer.invoke(
          'getTodoDays',
          moment(state.currentMonth).year(),
          moment(state.currentMonth).month() + 1
        );
        todoDate = todoDate.map((date: Partial<TodoType>) =>
          moment(date.dateTimestamp).format('YYYY-MM-DD')
        );
        dispatch({
          type: 'setTodoDays',
          value: [...new Set(todoDate)] as string[],
        });
      } catch (error) {
        console.log('Get TodoDays error: ', error);
      }
    })();
  }, [state.currentMonth]);

  // 切换月份
  const handleMonthChange = async (month: Date) => {
    dispatch({ type: 'setCurrentMonth', value: moment(month).valueOf() });
  };

  // 选择日期
  const handleDayClick = (day: Date) => {
    dispatch({
      type: 'changeDateOrClassify',
      value: { type: 'date', value: moment(day).format('YYYY-MM-DD') },
    });
  };

  const renderDay = (day: Date) => {
    const date = day.getDate();
    return (
      <DayWrapper>
        {date}
        {state.todoDays.includes(moment(day).format('YYYY-MM-DD')) && (
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
        onMonthChange={handleMonthChange}
        selectedDays={
          state.actived.type === 'date'
            ? new Date(moment(state.actived.value).valueOf())
            : undefined
        }
        renderDay={renderDay}
      />
    </DayPickerWrapper>
  );
}
