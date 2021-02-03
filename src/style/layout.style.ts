import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { MenuItemProps } from '../typings/style';

/**
 * 基础布局
 */
export const BaseLayout = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: stretch;
  overflow: hidden;
`;

export const ContainerLayout = styled.div`
  flex: 1;
  background-color: #2e2e2e;
`;

export const EmptyLayout = styled.div`
  text-align: center;
  padding-top: 36px;
  p {
    color: rgba(236, 236, 236, 0.45);
    margin: 12px;
  }
`;

/**
 * 菜单布局
 */
const bounce = keyframes`
  from, 20%, 53%, 80%, to {
    transform: translate3d(0,1px,0);
  }

  40%, 43% {
    transform: translate3d(0,-2px,0);
  }

  70% {
    transform: translate3d(0,-6px,0);
  }

  90% {
    transform: translate3d(0,-2px,0);
  }
`;

export const MenuLayout = styled.div`
  background-color: #222323;
  cursor: default;
  overflow: hidden;
`;

export const Icon = styled.span`
  margin-bottom: 4px;
  color: ${(props) => props.color};
  font-size: 20px;
`;

export const MenuItem = styled.div<MenuItemProps>`
  height: 64px;
  width: 74px;
  font-size: 12px;
  color: #fff;
  background-color: ${(props) => (props.actived ? '#2E2E2E' : '#222323')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding: 8px;
  transition: background 0.5s;
  &:hover {
    background-color: #2e2e2e;
  }
  &:active {
    ${Icon} {
      animation: ${bounce} 1s ease infinite;
    }
  }
`;

export const ActivedMark = styled.div`
  position: absolute;
  width: 4px;
  background-color: ${(props) => props.color};
  left: 0;
  top: 0;
  bottom: 0;
`;
