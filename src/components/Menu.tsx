import React, { useState } from 'react';
import {
  DiffFilled,
  FileMarkdownFilled,
  BulbFilled,
  InfoCircleFilled,
} from '@ant-design/icons';
import { MenuLayout, Icon, MenuItem, ActivedMark } from '../style/layout.style';

const menuItemList = [
  {
    id: 1,
    text: '任务',
    icon: <DiffFilled />,
    color: '#E44259',
  },
  {
    id: 2,
    text: '笔记',
    icon: <FileMarkdownFilled />,
    color: '#4CAF4F',
  },
  {
    id: 3,
    text: '脑图',
    icon: <BulbFilled />,
    color: '#5aabda',
  },
  {
    id: 4,
    text: '关于',
    icon: <InfoCircleFilled />,
    color: '#F07E4A',
  },
];

enum RouterEnum {
  '/todo' = 1,
  '/markdown',
  '/mindmap',
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
