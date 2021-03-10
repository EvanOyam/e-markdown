import React from 'react';
import styled from '@emotion/styled';
import CustomDayPicker from './CustomDayPicker';
import Classify from './Classify';

const TodoMenuWrapper = styled.div`
  background-color: #2e2e2e;
`;

export default function TodoMenu() {
  return (
    <TodoMenuWrapper>
      <CustomDayPicker />
      <Classify />
    </TodoMenuWrapper>
  );
}
