import styled from '@emotion/styled';

export const MarkdownWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export const MarkdownMenuWrapper = styled.div`
  background-color: #2e2e2e;
  padding: 8px;
  min-width: 284px;
  max-width: 500px;
`;

export const MarkdownPanel = styled.div`
  flex: 1;
  background-color: #272b31;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: scroll;
  height: 100vh;
  padding: 16px;
  padding-right: 0;
`;

export const MarkdownToolsbarWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #fbf8f5;
  margin-bottom: 12px;
  .anticon-plus {
    margin: 0 6px;
  }
`;
