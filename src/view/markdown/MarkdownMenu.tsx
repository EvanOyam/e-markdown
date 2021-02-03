import React, { useState, ChangeEvent, ReactElement } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Tree, Input } from 'antd';
import { PlusOutlined, QuestionOutlined } from '@ant-design/icons';
import { MarkdownMenuWrapper, MarkdownToolsbarWrapper } from './markdown.style';
import { TreeDataType, TreeKey, TreeMeta } from '../../typings/markdown';

const { Search } = Input;
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

const generateList = (
  rawData: TreeDataType<string>[],
  listData: TreeMeta<string>[]
) => {
  for (let i = 0; i < rawData.length; i++) {
    const node = rawData[i];
    const { key, title } = node;
    listData.push({ key, title });
    if (node.children) {
      generateList(node.children, listData);
    }
  }
};

const getParentKey = (key: TreeKey, tree: TreeDataType<string>[]): TreeKey => {
  let parentKey: TreeKey = '';
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

export default function MarkdownMenu() {
  const [treeData, setTreeData] = useState(data);
  const [searchValue, setSearchValue] = useState('');
  const [listData, setListData] = useState([] as TreeMeta<string>[]);
  const [expandedKeys, setExpandedKeys] = useState([] as TreeKey[]);

  useDeepCompareEffect(() => {
    const initListData: TreeMeta<string>[] = [];
    generateList(treeData, initListData);
    setListData(initListData);
  }, [treeData]);

  const onExpand = (keys: TreeKey[]) => {
    setExpandedKeys(keys);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value) {
      setSearchValue('');
      setExpandedKeys([]);
    } else {
      const keys = listData
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, treeData);
          }
          return '';
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      setSearchValue(value);
      setExpandedKeys(keys);
    }
  };

  const handleTreeData = (rawTreeData: TreeDataType<string>[]) =>
    rawTreeData.map(
      (item): TreeDataType<ReactElement> => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return {
            title,
            key: item.key,
            isLeaf: item.isLeaf,
            children: handleTreeData(item.children),
          };
        }
        return {
          title,
          isLeaf: item.isLeaf,
          key: item.key,
        };
      }
    );

  const createMarkdown = () => {
    const testData = {
      title: 'test',
      key: `test-${+new Date()}`,
      isLeaf: true,
    };
    const newTreeData = treeData.concat(testData);
    setTreeData(newTreeData);
  };

  return (
    <MarkdownMenuWrapper>
      <MarkdownToolsbarWrapper>
        <Search placeholder="Search" onChange={onChange} />
        <PlusOutlined
          onClick={createMarkdown}
          style={{ fontSize: '18px', cursor: 'pointer' }}
        />
        <QuestionOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
      </MarkdownToolsbarWrapper>
      <DirectoryTree
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        treeData={handleTreeData(treeData)}
      />
    </MarkdownMenuWrapper>
  );
}
