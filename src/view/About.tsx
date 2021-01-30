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

export default function About() {
  const history = useHistory();
  const gotoMain = () => {
    history.replace('/');
  };
  return (
    <Layout>
      <h1>About</h1>
      <Button onClick={gotoMain} type="primary">
        Go to main
      </Button>
    </Layout>
  );
}
