import styled from '@emotion/styled';

export const MindmapWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export const MindmapMenuWrapper = styled.div`
  background-color: #2e2e2e;
  padding: 8px;
  min-width: 284px;
  max-width: 500px;
`;

export const MindmapPanel = styled.div`
  flex: 1;
  background-color: #272b31;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: scroll;
  height: 100vh;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MindmapToolsbarWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #fbf8f5;
  margin-bottom: 12px;
  .anticon-plus {
    margin: 0 6px;
  }
`;
