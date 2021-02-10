import React, { useState, ChangeEvent, ReactElement, useEffect } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Tree, Input, Popover, Button, Modal, Form, Select } from 'antd';
import { PlusOutlined, QuestionOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { ipcRenderer } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { MarkdownMenuWrapper, MarkdownToolsbarWrapper } from './markdown.style';
import { TreeDataType, TreeKey, TreeMeta } from '../../typings/markdown';

const { Search } = Input;
const { Option } = Select;
const { DirectoryTree } = Tree;

const generateList = (
  rawData: TreeDataType<string>[],
  searchMenuData: TreeMeta<string>[]
) => {
  for (let i = 0; i < rawData.length; i++) {
    const node = rawData[i];
    const { key, title } = node;
    searchMenuData.push({ key, title });
    if (node.children) {
      generateList(node.children, searchMenuData);
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
  const [menuData, setMenuData] = useState([] as TreeDataType<string>[]); // 原始数据
  const [searchMenuData, setSearchMenuData] = useState(
    [] as TreeMeta<string>[]
  ); // 搜索树数据
  const [expandedKeys, setExpandedKeys] = useState([] as TreeKey[]); // 当前树展开中的 keys
  const [searchValue, setSearchValue] = useState(''); // 搜索值
  const [visibleModal, setVisibleModal] = useState(''); // 新建分类或文章弹窗
  const [classifyForm] = Form.useForm(); // 新建分类的表单
  const [mdForm] = Form.useForm(); // 新建文档的表单

  // 获取原始数据
  useEffect(() => {
    (async () => {
      let classify = await ipcRenderer.invoke('getMdClassify');
      if (!classify || classify.length === 0) {
        const createTime = +new Date();
        const params = {
          id: uuidv4().replace(/-/g, ''),
          name: '默认分类',
          createdAt: createTime,
          updatedAt: createTime,
        };
        await ipcRenderer.invoke('createMdClassify', params);
        classify = await ipcRenderer.invoke('getMdClassify');
      }
      setMenuData(classify);
    })();
  }, []);

  // 处理搜索树数据
  useDeepCompareEffect(() => {
    const renderData: TreeMeta<string>[] = [];
    generateList(menuData, renderData);
    setSearchMenuData(renderData);
  }, [menuData]);

  // 搜索
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value) {
      setSearchValue('');
      setExpandedKeys([]);
    } else {
      const keys = searchMenuData
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, menuData);
          }
          return '';
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      setSearchValue(value);
      setExpandedKeys(keys);
    }
  };

  // 处理成 menu 渲染所需的数据结构
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

  // 新建分类
  const createMdClassify = async () => {
    try {
      await classifyForm.validateFields();
      const createTime = +new Date();
      const params = {
        id: uuidv4().replace(/-/g, ''),
        name: classifyForm.getFieldValue('name'),
        createdAt: createTime,
        updatedAt: createTime,
      };
      await ipcRenderer.invoke('createMdClassify', params);
      const classify = await ipcRenderer.invoke('getMdClassify');
      setMenuData(classify);
      setVisibleModal('');
    } catch (error) {
      console.log('Create markdown classify error: ', error);
    }
  };

  // 新建文档
  const createMd = async () => {
    try {
      await mdForm.validateFields();
      const id = uuidv4().replace(/-/g, '');
      const date = +new Date();

      // 写入文档
      const dirPath = path.join(__dirname, '..', 'assets', 'docs', 'markdown');
      const mdPath = path.join(dirPath, `${id}.md`);
      const hasDir = await fs.existsSync(dirPath);
      if (!hasDir) await fs.promises.mkdir(dirPath, { recursive: true });
      await fs.promises.writeFile(mdPath, '');

      // md 元数据写入数据库
      const params = {
        id,
        title: mdForm.getFieldValue('title'),
        mdpath: mdPath,
        classify: mdForm.getFieldValue('classify'),
        createdAt: date,
        updatedAt: date,
      };
      await ipcRenderer.invoke('createMd', params);

      // 更新分类树且关闭弹窗
      const classify = await ipcRenderer.invoke('getMdClassify');
      setMenuData(classify);
      setVisibleModal('');
    } catch (error) {
      console.log('Create markdown error: ', error);
    }
  };

  // 选择新建类型
  const renderCreateSelect = () => {
    return (
      <>
        <Button
          type="link"
          onClick={() => {
            classifyForm.setFieldsValue({ name: '' });
            setVisibleModal('classify');
          }}
        >
          新建分类
        </Button>
        <br />
        <Button
          type="link"
          onClick={() => {
            mdForm.setFieldsValue({ title: '', classify: menuData[0].key });
            setVisibleModal('markdown');
          }}
        >
          新建文档
        </Button>
      </>
    );
  };

  // 新建分类表单
  const renderClassifyForm = () => {
    return (
      <Form
        form={classifyForm}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: '分类名不能为空' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    );
  };

  // 新建文档表单
  const renderMdForm = () => {
    return (
      <Form form={mdForm} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '标题不能为空' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="分类" name="classify">
          <Select placeholder="请选择分类">
            {menuData.map((classify) => {
              return (
                <Option key={classify.key} value={classify.key}>
                  {classify.title}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    );
  };

  // 新建弹窗
  const renderModal = (title: string, type: string) => {
    return (
      <Modal
        title={title}
        visible={visibleModal === type}
        onCancel={() => setVisibleModal('')}
        centered
        footer={
          <Button
            type="primary"
            onClick={type === 'classify' ? createMdClassify : createMd}
          >
            创建
          </Button>
        }
      >
        {type === 'classify' ? renderClassifyForm() : renderMdForm()}
      </Modal>
    );
  };

  return (
    <MarkdownMenuWrapper>
      <MarkdownToolsbarWrapper>
        <Search placeholder="Search" onChange={onChange} />
        <Popover trigger="click" content={renderCreateSelect}>
          <PlusOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
        </Popover>
        <QuestionOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
      </MarkdownToolsbarWrapper>
      <DirectoryTree
        expandedKeys={expandedKeys}
        onExpand={(keys: TreeKey[]) => setExpandedKeys(keys)}
        treeData={handleTreeData(menuData)}
      />
      {renderModal('新建分类', 'classify')}
      {renderModal('新建文档', 'markdown')}
    </MarkdownMenuWrapper>
  );
}
