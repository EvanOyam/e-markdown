import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { MenuItemProps } from '../typings/style';

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
