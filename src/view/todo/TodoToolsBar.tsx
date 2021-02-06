import React, { useContext, useState } from 'react';
import {
  PageHeader,
  Input,
  Modal,
  Button,
  Form,
  DatePicker,
  Select,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  ImportOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { ipcRenderer } from 'electron';
import { TodoMeta, TodoToolsBarProps } from '../../typings/todo';
import { TodoContext } from '../../context/todoContext';
import Editor from '../../components/Editor';

const { Search } = Input;
const { Option } = Select;

const ToolsBarActionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 232px;
  color: rgb(236, 236, 236);
`;

export default function TodoToolsBar(props: TodoToolsBarProps) {
  const { state, dispatch } = useContext(TodoContext);
  const [mdContent, setMdContent] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { title, todoCount } = props; // todo

  // todo
  const onSearch = (value: string) => {
    return value;
  };

  // todo 细分 catch，抽象存储索引逻辑
  const handleCreateTodo = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      const id = uuidv4();
      const todoPath = path.join(__dirname, '..', 'assets', 'docs', 'todo');
      const mdPath = path.join(todoPath, `${id}.md`);
      const todoData: TodoMeta = {
        id,
        title: form.getFieldValue('title'),
        date: form.getFieldValue('date').valueOf(),
        status: 0,
        classify: form.getFieldValue('classify'),
        path: `todo/${id}`,
        createdAt: +new Date(),
        alarmDate: +new Date(), // todo 加入提醒功能
      };
      const newList = state.todoListData.concat(todoData);

      // 持久化 md
      await fs.promises.writeFile(mdPath, mdContent);
      // 创建日期索引
      const date = moment().format('YYYY-MM-DD');
      const dateIndex = await ipcRenderer.invoke(
        'getStoreValue',
        `todo.dateIndex.${date}`
      );
      const dateValue = dateIndex ? [...dateIndex, id] : [id];
      await ipcRenderer.invoke(
        'setStoreValue',
        `todo.dateIndex.${date}`,
        dateValue
      );
      // 创建分类索引
      const classify = form.getFieldValue('classify');
      const classifyIndex = await ipcRenderer.invoke(
        'getStoreValue',
        `todo.classifyIndex.${classify}`
      );
      const classifyValue = classifyIndex ? [...classifyIndex, id] : [id];
      await ipcRenderer.invoke(
        'setStoreValue',
        `todo.classifyIndex.${classify}`,
        classifyValue
      );
      // 创建源文件信息
      let storeTodoData = await ipcRenderer.invoke(
        'getStoreValue',
        `todo.data`
      );
      if (!storeTodoData) storeTodoData = {};
      storeTodoData[id] = todoData;
      await ipcRenderer.invoke('setStoreValue', `todo.data`, storeTodoData);
      // 更新列表，重置弹窗状态并关闭弹窗
      dispatch({ type: 'setTodoListData', value: newList });
      form.setFieldsValue({
        title: '',
        date: moment(),
        classify: 1,
      });
      setMdContent('');
      setLoading(false);
      setIsModalVisible(false);
    } catch (error) {
      setLoading(false);
      console.log('error: ', error);
    }
  };

  return (
    <>
      <PageHeader
        className="site-page-header"
        title={title}
        subTitle={`剩余 ${todoCount} 项代办`}
        extra={
          <ToolsBarActionWrapper>
            <Search
              placeholder="搜索"
              onSearch={onSearch}
              style={{ width: 200 }}
            />
            <PlusOutlined
              style={{ fontSize: '20px', cursor: 'pointer' }}
              onClick={() => {
                setIsModalVisible(true);
              }}
            />
            {/* <ImportOutlined style={{ fontSize: '20px', cursor: 'pointer' }} /> // todo 加入导入功能 */}
            {/* <DownloadOutlined style={{ fontSize: '20px', cursor: 'pointer' }} /> // todo 加入导出功能 */}
          </ToolsBarActionWrapper>
        }
      />
      <Modal
        title="新建任务"
        width={680}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        centered
        footer={
          <Button type="primary" onClick={handleCreateTodo} loading={loading}>
            创建
          </Button>
        }
      >
        <Form
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          initialValues={{
            title: '',
            date: moment(),
            classify: 1,
          }}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请填写标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="日期和分类">
            <Row>
              <Col span={12}>
                <Form.Item name="date">
                  <DatePicker allowClear={false} style={{ width: '232px' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="classify">
                  <Select placeholder="请选择分类">
                    <Option value={1}>备忘录</Option>
                    <Option value={2}>工作</Option>
                    <Option value={3}>学习</Option>
                    <Option value={4}>其他</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Form>
        <Editor
          textValue={mdContent}
          handleChange={(text: string) => {
            setMdContent(text);
          }}
          maxHeight="230px"
          withoutBorder
        />
      </Modal>
    </>
  );
}
