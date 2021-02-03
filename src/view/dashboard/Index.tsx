import React from 'react';
import ChartPanel from './ChartPanel';
import { DashboardWrapper } from './dashboard.style';
import TodoPanel from './TodoPanel';

export default function Dashboard() {
  return (
    <DashboardWrapper>
      <TodoPanel />
      <ChartPanel />
    </DashboardWrapper>
  );
}
