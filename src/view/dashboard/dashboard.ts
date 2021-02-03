import styled from '@emotion/styled';
import { CardWrapperType } from '../../typings/dashboard';

export const DashboardWrapper = styled.div`
  display: flex;
`;

export const TodoPanelWrapper = styled.div`
  height: 100vh;
  overflow: hidden;
  padding: 24px;
  background-color: #2e2e2e;
  display: flex;
  flex-direction: column;
`;

export const TodoPanelTitle = styled.h2`
  margin-bottom: 8px;
`;

export const TodoPanelList = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

export const CardWrapper = styled.div<CardWrapperType>`
  width: 284px;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ChartPanelWrapper = styled.div`
  background: #272b31;
  flex: 1;
`;
