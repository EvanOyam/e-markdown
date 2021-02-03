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

export const TodoPanelTitle = styled.h3`
  margin-bottom: 12px;
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
  padding: 12px 24px 24px 24px;
  background: #272b31;
  height: 100vh;
  overflow-y: scroll;
  flex: 1;
`;

export const ChartOuterWrapper = styled.div`
  /* background-color: yellowgreen; */
`;

export const ChartTitle = styled.h3`
  padding: 12px;
  margin-top: 12px;
  width: 560px;
  background-color: #2d2938;
`;

export const ChartWrapper = styled.div`
  height: 300px;
  width: 560px;
  background-color: #201d27;
`;
