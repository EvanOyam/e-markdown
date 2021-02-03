import styled from '@emotion/styled';

export const TodoWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export const DayPickerLayout = styled.div`
  height: 360px;
`;

export const TodoMenu = styled.div`
  background-color: #2e2e2e;
`;

export const TodoPanel = styled.div`
  flex: 1;
  background-color: #272b31;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export const TodoListWrapper = styled.div`
  padding: 16px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

export const TableWrapper = styled.div`
  height: 48%;
  overflow: hidden;
`;

export const ClassifyLayout = styled.div`
  padding: 16px;
  overflow: hidden;
  border-top: 1px solid rgba(255, 253, 238, 0.1);
`;

export const DayStyle = styled.div`
  position: relative;
`;

export const LineWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
`;

export const IconWrapper = styled.div`
  line-height: 18px;
  font-size: 18px;
  & > span {
    margin: 0 4px;
    &:hover {
      cursor: pointer;
    }
  }
`;

export const ToolsBarActionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 260px;
  color: rgb(236, 236, 236);
`;
