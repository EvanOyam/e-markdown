import React, { useState } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
} from 'recharts';
import moment from 'moment';
import { ChartWrapper } from './dashboard.style';

const mockTodoChartData = [
  {
    day: moment().add(-6, 'd').format('MM-DD'),
    finishedCount: 2,
    todoCount: 1,
  },
  {
    day: moment().add(-5, 'd').format('MM-DD'),
    finishedCount: 1,
    todoCount: 3,
  },
  {
    day: moment().add(-4, 'd').format('MM-DD'),
    finishedCount: 2,
    todoCount: 2,
  },
  {
    day: moment().add(-3, 'd').format('MM-DD'),
    finishedCount: 8,
    todoCount: 2,
  },
  {
    day: moment().add(-2, 'd').format('MM-DD'),
    finishedCount: 6,
    todoCount: 6,
  },
  {
    day: moment().add(-1, 'd').format('MM-DD'),
    finishedCount: 2,
    todoCount: 0,
  },
  {
    day: moment().format('MM-DD'),
    finishedCount: 3,
    todoCount: 1,
  },
].map((item) => {
  return {
    ...item,
    percent: (
      item.finishedCount /
      (item.finishedCount + item.todoCount)
    ).toFixed(2),
  };
});

const CustomTooltip = (props: TooltipProps<string, string>) => {
  const { active, payload } = props;
  if (active && payload) {
    const { finishedCount, todoCount, percent } = payload[0].payload;
    return (
      <div className="rechart-custom-tooltip">
        <p className="rechart-custom-tooltip-title">
          {`完成率: ${percent * 100}%`}
        </p>
        <p className="rechart-custom-tooltip-desc">
          {`已完成 ${finishedCount} 件`} <br /> {`未完成 ${todoCount} 件`}
        </p>
      </div>
    );
  }
  return null;
};

export default function TodoChart() {
  const [todoChartData, setTodoChartData] = useState(mockTodoChartData);
  return (
    <ChartWrapper>
      <LineChart
        width={540}
        height={300}
        data={todoChartData}
        margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
      >
        <Line type="monotone" dataKey="percent" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ChartWrapper>
  );
}
