import styled from '@emotion/styled';
import React from 'react';
import './style/default.global.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { BulbTwoTone } from '@ant-design/icons';
import Menu from './components/Menu';
import About from './view/About';
import Home from './view/Home';
import Markdown from './view/Markdown';
import Todo from './view/Todo';

const BaseLayout = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: stretch;
  overflow: hidden;
`;

const ContainerLayout = styled.div`
  flex: 1;
  background-color: #2e2e2e;
`;

const EmptyLayout = styled.div`
  text-align: center;
  padding-top: 36px;
  p {
    color: rgba(236, 236, 236, 0.45);
    margin: 12px;
  }
`;

const customizeRenderEmpty = () => (
  <EmptyLayout>
    <BulbTwoTone style={{ fontSize: '72px' }} twoToneColor="#575861" />
    <p>暂无数据</p>
  </EmptyLayout>
);

export default function App() {
  return (
    <ConfigProvider renderEmpty={customizeRenderEmpty}>
      <BaseLayout>
        <Menu />
        <ContainerLayout>
          <Router>
            <Switch>
              <Route path="/about" component={About} />
              <Route path="/todo" component={Todo} />
              <Route path="/markdown" component={Markdown} />
              <Route path="/" component={Home} />
            </Switch>
          </Router>
        </ContainerLayout>
      </BaseLayout>
    </ConfigProvider>
  );
}
