import React from 'react';
import { Button } from 'antd';
import styled from '@emotion/styled';
import { useHistory } from 'react-router-dom';

const Layout = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Main() {
  const history = useHistory();
  const gotoAbout = () => {
    history.replace('/about');
  };
  return (
    <Layout>
      <h1>Main</h1>
      <Button onClick={gotoAbout} type="primary">
        Go to about
      </Button>
    </Layout>
  );
}
