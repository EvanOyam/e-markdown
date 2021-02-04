import React from 'react';
import './style/default.global.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { BulbTwoTone } from '@ant-design/icons';
import Menu from './components/Menu';
import Dashboard from './view/dashboard/Index';
import Todo from './view/todo/Index';
import Markdown from './view/markdown/Index';
import Mindmap from './view/mindmap/Index';
import About from './view/about/Index';
import { EmptyLayout, BaseLayout, ContainerLayout } from './style/layout.style';
import '@fortawesome/fontawesome-free/js/all';

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
              <Route path="/mindmap" component={Mindmap} />
              <Route path="/todo" component={Todo} />
              <Route path="/markdown" component={Markdown} />
              <Route path="/" component={Dashboard} />
            </Switch>
          </Router>
        </ContainerLayout>
      </BaseLayout>
    </ConfigProvider>
  );
}
