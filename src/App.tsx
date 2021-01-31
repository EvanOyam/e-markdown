import styled from '@emotion/styled';
import React from 'react';
import './style/default.global.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
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

export default function App() {
  return (
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
  );
}
