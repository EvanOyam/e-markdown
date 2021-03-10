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
import { PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { ipcRenderer } from 'electron';
import { TodoContext } from '../../context/todoContext';
import Editor from '../../components/Editor';
import { TodoType } from '../../typings/database';

const { Search } = Input;
const { Option } = Select;

const ToolsBarActionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 232px;
  color: rgb(236, 236, 236);
`;

export default function TodoToolsBar() {
  const { state, dispatch } = useContext(TodoContext);
  const [mdContent, setMdContent] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onSearch = async (value: string) => {
    dispatch({ type: 'setHeaderTitle', value: `搜索关键字：${value}` });
    dispatch({
      type: 'changeDateOrClassify',
      value: { type: '', value: '' },
    });
    if (!value) {
      dispatch({ type: 'setSelectedFinishedRowsKeys', value: [] });
      dispatch({ type: 'setTodoListData', value: [] });
      dispatch({ type: 'setFinishedListData', value: [] });
    } else {
      const todoList = await ipcRenderer.invoke('searchTodo', value, 0);
      const finishedList = await ipcRenderer.invoke('searchTodo', value, 1);
      const finishedListKeys = finishedList.map(
        (record: TodoType) => record.id
      );
      dispatch({
        type: 'setSelectedFinishedRowsKeys',
        value: finishedListKeys,
      });
      dispatch({ type: 'setTodoListData', value: todoList });
      dispatch({ type: 'setFinishedListData', value: finishedList });
    }
  };

  // todo refactor: 细分 catch
  // todo feat: 加入提醒功能
  const handleCreateTodo = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      const id = uuidv4().replace(/-/g, '');
      const createdAt = +new Date();
      const todoDate = form.getFieldValue('date').valueOf();

      // 持久化 md
      // todo feat: 抽象 path 到 config
      const dirPath = path.join(__dirname, '..', 'assets', 'docs', 'markdown');
      const mdPath = path.join(dirPath, `${id}.md`);
      const hasDir = await fs.existsSync(dirPath);
      if (!hasDir) await fs.promises.mkdir(dirPath, { recursive: true });
      await fs.promises.writeFile(mdPath, mdContent);

      // 任务信息写入数据库
      const params: TodoType = {
        id,
        title: form.getFieldValue('title'),
        dateTimestamp: todoDate,
        date: moment(todoDate).format('YYYY-MM-DD'),
        status: 0,
        classify: form.getFieldValue('classify'),
        path: mdPath,
        createdAt,
        updatedAt: createdAt,
      };
      await ipcRenderer.invoke('createTodo', params);

      // 重新获取列表数据
      if (
        moment(todoDate).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
      ) {
        const query = {} as Partial<TodoType>;
        if (state.actived.type === 'date') {
          query.date = state.actived.value;
        } else if (state.actived.type === 'classify') {
          query.classify = state.actived.value;
        }
        const todoList: TodoType[] = await ipcRenderer.invoke(
          'getTodoList',
          ['*'],
          {
            ...query,
            status: 0,
          }
        );
        const finishedList: TodoType[] = await ipcRenderer.invoke(
          'getTodoList',
          ['*'],
          {
            ...query,
            status: 1,
          }
        );
        const finishedListKeys = finishedList.map((record) => record.id);
        dispatch({
          type: 'setSelectedFinishedRowsKeys',
          value: finishedListKeys,
        });
        dispatch({ type: 'setTodoListData', value: todoList });
        dispatch({ type: 'setFinishedListData', value: finishedList });
      }

      // 更新日历
      const currentDate = state.currentMonth;
      let todoDays = await ipcRenderer.invoke(
        'getTodoDays',
        moment(currentDate).year(),
        moment(currentDate).month() + 1
      );
      todoDays = todoDays.map((date: Partial<TodoType>) =>
        moment(date.dateTimestamp).format('YYYY-MM-DD')
      );
      dispatch({
        type: 'setTodoDays',
        value: [...new Set(todoDays)] as string[],
      });

      // 更新分类
      const classifyCount = await ipcRenderer.invoke('countTodo');
      dispatch({ type: 'setClassifyCount', value: classifyCount });

      // 重置弹窗信息
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
      console.log('Createerror: ', error);
    }
  };

  return (
    <>
      <PageHeader
        className="site-page-header"
        title={state.headerTitle}
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
            {/* // todo feat: 加入导入功能 */}
            {/* <ImportOutlined style={{ fontSize: '20px', cursor: 'pointer' }} /> */}
            {/* // todo feat: 加入导出功能 */}
            {/* <DownloadOutlined style={{ fontSize: '20px', cursor: 'pointer' }} /> */}
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
          handleSave={handleCreateTodo}
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
