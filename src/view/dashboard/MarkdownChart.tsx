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

const mockMarkdownChartData = [
  {
    day: moment().add(-6, 'd').format('MM-DD'),
    createCount: 3,
    inputCount: 1689,
  },
  {
    day: moment().add(-5, 'd').format('MM-DD'),
    createCount: 1,
    inputCount: 358,
  },
  {
    day: moment().add(-4, 'd').format('MM-DD'),
    createCount: 5,
    inputCount: 1380,
  },
  {
    day: moment().add(-3, 'd').format('MM-DD'),
    createCount: 1,
    inputCount: 267,
  },
  {
    day: moment().add(-2, 'd').format('MM-DD'),
    createCount: 3,
    inputCount: 1259,
  },
  {
    day: moment().add(-1, 'd').format('MM-DD'),
    createCount: 2,
    inputCount: 678,
  },
  {
    day: moment().format('MM-DD'),
    createCount: 1,
    inputCount: 258,
  },
];

const CustomTooltip = (props: TooltipProps<string, string>) => {
  const { active, payload } = props;
  if (active && payload) {
    const { createCount, inputCount } = payload[0].payload;
    return (
      <div className="rechart-custom-tooltip">
        <p className="rechart-custom-tooltip-title">
          {`新建文章: ${createCount}`}
        </p>
        <p className="rechart-custom-tooltip-desc">
          {`共写入 ${inputCount} 字`}
        </p>
      </div>
    );
  }
  return null;
};

export default function MarkdownChart() {
  const [markdownChartData, setMarkdownChartData] = useState(
    mockMarkdownChartData
  );
  return (
    <ChartWrapper>
      <LineChart
        width={540}
        height={300}
        data={markdownChartData}
        margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
      >
        <Line type="monotone" dataKey="inputCount" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ChartWrapper>
  );
}
