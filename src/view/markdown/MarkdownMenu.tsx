import React, {
  useState,
  ChangeEvent,
  ReactElement,
  useEffect,
  useContext,
} from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Tree, Input, Popover, Button, Modal, Form, Select } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { ipcRenderer, remote } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import styled from '@emotion/styled';
import { EventDataNode } from 'antd/lib/tree';
import { TreeDataType, TreeKey, TreeMeta } from '../../typings/markdown';
import { MdContext } from '../../context/markdownContext';

const { Menu, MenuItem } = remote;
const { Search } = Input;
const { Option } = Select;
const { DirectoryTree } = Tree;
const { confirm } = Modal;

const MarkdownMenuWrapper = styled.div`
  background-color: #2e2e2e;
  padding: 8px;
  min-width: 284px;
  max-width: 500px;
`;

const MarkdownToolsbarWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #fbf8f5;
  margin-bottom: 12px;
  .anticon-plus {
    margin-left: 6px;
  }
`;

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
  // todo refactor: state 整合进 context
  const { state, dispatch } = useContext(MdContext);
  const [menuData, setMenuData] = useState([] as TreeDataType<string>[]); // 原始数据
  const [searchMenuData, setSearchMenuData] = useState(
    [] as TreeMeta<string>[]
  ); // 搜索树数据
  const [expandedKeys, setExpandedKeys] = useState([] as TreeKey[]); // 当前树展开中的 keys
  const [searchValue, setSearchValue] = useState(''); // 搜索值
  const [visibleModal, setVisibleModal] = useState(''); // 新建分类或文章弹窗
  const [classifyForm] = Form.useForm(); // 新建分类的表单
  const [mdForm] = Form.useForm(); // 新建文档的表单
  const [renameForm] = Form.useForm(); // 新建文档的表单

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
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  // 选择节点
  const handleSelect = (selectedKeys: React.Key[], info: any) => {
    const isMd = info.node.isLeaf;
    const mdId = selectedKeys[0] as string;
    if (isMd) {
      dispatch({ type: 'setOpenMdId', value: mdId });
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

  // 重命名弹窗
  const renderRenameModal = () => {
    const rename = async () => {
      try {
        await renameForm.validateFields();
        const renameInfo = visibleModal.split('-');
        const type = renameInfo[1] === 'md' ? 'renameMd' : 'renameMdClassify';
        const params =
          renameInfo[1] === 'md'
            ? {
                title: renameForm.getFieldValue('name'),
                id: renameInfo[2],
              }
            : {
                name: renameForm.getFieldValue('name'),
                id: renameInfo[2],
              };
        await ipcRenderer.invoke(type, params);
        const classify = await ipcRenderer.invoke('getMdClassify');
        setMenuData(classify);
        setVisibleModal('');
      } catch (error) {
        console.log('Create markdown classify error: ', error);
      }
    };
    return (
      <Modal
        title="重命名"
        visible={visibleModal.startsWith('rename')}
        onCancel={() => setVisibleModal('')}
        centered
        footer={
          <Button type="primary" onClick={rename}>
            确定
          </Button>
        }
      >
        <Form
          form={renameForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '名称不能为空' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  // 右键
  const handleRightClick = (node: EventDataNode) => {
    if (node.pos === '0-0') return;
    const { isLeaf, key } = node;
    const delConfirm = () => {
      const title = isLeaf ? '确定删除文章吗？' : '确认删除分类吗？';
      const content = (
        <p>
          开发者懒得做回收站，删除后不可恢复！
          <br />
          {!isLeaf && '删除分类会删除分类下所有文章！'}
        </p>
      );
      const del = async () => {
        try {
          const delType = isLeaf ? 'deleteMd' : 'deleteMdClassify';
          await ipcRenderer.invoke(delType, key);
          const classify = await ipcRenderer.invoke('getMdClassify');
          setMenuData(classify);
          if (!isLeaf || key === state.openMdId) {
            dispatch({ type: 'setOpenMdId', value: '' });
          }
        } catch (error) {
          console.log('Delete markdown error: ', error);
        }
      };

      confirm({
        centered: true,
        title,
        icon: <ExclamationCircleOutlined />,
        content,
        onOk: del,
        onCancel() {},
      });
    };
    const rename = () => {
      const type = isLeaf ? 'md' : 'classify';
      renameForm.setFieldsValue({ name: '' });
      setVisibleModal(`rename-${type}-${key}`);
    };

    const menu = new Menu();
    menu.append(
      new MenuItem({
        label: '删除',
        click: delConfirm,
      })
    );
    menu.append(
      new MenuItem({
        label: '重命名',
        click: rename,
      })
    );
    menu.popup({ window: remote.getCurrentWindow() });
  };

  return (
    <MarkdownMenuWrapper>
      <MarkdownToolsbarWrapper>
        <Search placeholder="Search" onChange={handleChange} />
        <Popover trigger="click" content={renderCreateSelect}>
          <PlusOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
        </Popover>
      </MarkdownToolsbarWrapper>
      <DirectoryTree
        onRightClick={({ node }) => handleRightClick(node)}
        onSelect={handleSelect}
        expandedKeys={expandedKeys}
        onExpand={(keys: TreeKey[]) => setExpandedKeys(keys)}
        treeData={handleTreeData(menuData)}
      />
      {renderModal('新建分类', 'classify')}
      {renderModal('新建文档', 'markdown')}
      {renderRenameModal()}
    </MarkdownMenuWrapper>
  );
}
