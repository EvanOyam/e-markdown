import React, { useState } from 'react';
import {
  HomeFilled,
  DiffFilled,
  FileMarkdownFilled,
  InfoCircleFilled,
} from '@ant-design/icons';
import { MenuLayout, Icon, MenuItem, ActivedMark } from '../style/menu.style';

const menuItemList = [
  {
    id: 1,
    text: 'Home',
    icon: <HomeFilled />,
    color: '#727CA9',
  },
  {
    id: 2,
    text: 'Todo',
    icon: <DiffFilled />,
    color: '#E44259',
  },
  {
    id: 3,
    text: 'Markdown',
    icon: <FileMarkdownFilled />,
    color: '#4CAF4F',
  },
  {
    id: 4,
    text: 'About',
    icon: <InfoCircleFilled />,
    color: '#F07E4A',
  },
];

enum RouterEnum {
  '/' = 1,
  '/todo',
  '/markdown',
  '/about',
}

export default function Menu() {
  const path = window.location.hash.replace(/#/, '') as keyof typeof RouterEnum;
  const initialActivedIcon = RouterEnum[path];
  const [activedIcon, setActivedIcon] = useState(initialActivedIcon || 1);
  const changeTab = (id: number) => {
    window.location.hash = `#${RouterEnum[id]}`;
    setActivedIcon(id);
  };

  return (
    <MenuLayout>
      {menuItemList.map((menuItem) => (
        <MenuItem
          onClick={() => changeTab(menuItem.id)}
          key={menuItem.id}
          actived={menuItem.id === activedIcon}
        >
          {menuItem.id === activedIcon && (
            <ActivedMark color={menuItem.color} />
          )}
          <Icon color={menuItem.color}>{menuItem.icon}</Icon>
          <span>{menuItem.text}</span>
        </MenuItem>
      ))}
    </MenuLayout>
  );
}
