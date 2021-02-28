import styled from '@emotion/styled';
import React from 'react';
import { FolderOpenOutlined } from '@ant-design/icons';

const EmptyWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  h2 {
    color: rgb(184, 184, 184, 0.5);
    margin-top: 12px;
  }
`;

export default function Empty() {
  return (
    <EmptyWrapper>
      <FolderOpenOutlined
        style={{ fontSize: '64px', color: 'rgb(184, 184, 184,0.5)' }}
      />
      <h2>请选择文档</h2>
    </EmptyWrapper>
  );
}
