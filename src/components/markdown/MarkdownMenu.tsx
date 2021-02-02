import React, { useState } from 'react';
import { Tree } from 'antd';

const { DirectoryTree } = Tree;

const data = [
  {
    title: 'parent 0',
    key: '0-0',
    children: [
      {
        title: 'leaf 0-0',
        key: '0-0-0',
        isLeaf: true,
      },
      {
        title: 'leaf 0-1',
        key: '0-0-1',
        isLeaf: true,
      },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      {
        title: 'leaf 1-0',
        key: '0-1-0',
        isLeaf: true,
      },
      {
        title: 'leaf 1-1',
        key: '0-1-1',
        isLeaf: true,
      },
    ],
  },
  {
    title: 'parent 2',
    key: '0-2',
    isLeaf: true,
  },
];

export default function MarkdownMenu() {
  const [treeData, setTreeData] = useState(data);
  const onSelect = (keys: any, info: any) => {
    console.log('Trigger Select', keys, info);
  };

  const onExpand = () => {
    console.log('Trigger Expand');
  };
  return (
    <DirectoryTree
      multiple
      onSelect={onSelect}
      onExpand={onExpand}
      treeData={treeData}
    />
  );
}
