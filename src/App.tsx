import React from 'react';
import './style/default.global.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { BulbTwoTone } from '@ant-design/icons';
import Menu from './components/Menu';
import About from './view/about/Index';
import Home from './view/home/Index';
import Markdown from './view/markdown/Index';
import Todo from './view/todo/Index';
import { EmptyLayout, BaseLayout, ContainerLayout } from './style/layout.style';

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
