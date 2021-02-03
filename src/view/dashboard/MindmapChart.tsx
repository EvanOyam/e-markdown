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

const mockMindmapChartData = [
  {
    day: moment().add(-6, 'd').format('MM-DD'),
    createCount: 3,
  },
  {
    day: moment().add(-5, 'd').format('MM-DD'),
    createCount: 1,
  },
  {
    day: moment().add(-4, 'd').format('MM-DD'),
    createCount: 5,
  },
  {
    day: moment().add(-3, 'd').format('MM-DD'),
    createCount: 1,
  },
  {
    day: moment().add(-2, 'd').format('MM-DD'),
    createCount: 3,
  },
  {
    day: moment().add(-1, 'd').format('MM-DD'),
    createCount: 2,
  },
  {
    day: moment().format('MM-DD'),
    createCount: 1,
  },
];

const CustomTooltip = (props: TooltipProps<string, string>) => {
  const { active, payload } = props;
  if (active && payload) {
    const { createCount } = payload[0].payload;
    return (
      <div className="rechart-custom-tooltip">
        <p className="rechart-custom-tooltip-title-noborder">
          {`新建脑图: ${createCount}`}
        </p>
      </div>
    );
  }
  return null;
};

export default function MindmapChart() {
  const [mindmapChartData, setMindmapChartData] = useState(
    mockMindmapChartData
  );
  return (
    <ChartWrapper>
      <LineChart
        width={540}
        height={300}
        data={mindmapChartData}
        margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
      >
        <Line type="monotone" dataKey="createCount" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ChartWrapper>
  );
}
