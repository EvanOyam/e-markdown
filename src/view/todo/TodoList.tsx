import React, { useEffect, useRef, useContext, useState } from 'react';
import { Table, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';
import useDeepCompareEffect from 'use-deep-compare-effect';
import moment from 'moment';
import { TodoListProps, TodoTableType } from '../../typings/todo';
import useResize from '../../hooks/useResize';
import { TodoContext } from '../../context/todoContext';
import TodoDetail from './TodoDetail';
import { TodoType } from '../../typings/database';

const { Column } = Table;
const { confirm } = Modal;

const TodoListWrapper = styled.div`
  padding: 16px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

const TableWrapper = styled.div`
  height: 48%;
  overflow: hidden;
`;

const LineWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
`;

const IconWrapper = styled.div`
  line-height: 18px;
  font-size: 18px;
  & > span {
    margin: 0 4px;
    &:hover {
      cursor: pointer;
    }
  }
`;

// todo refactor: list 用 memo 渲染
export default function TodoList(todoListProps: TodoListProps) {
  const { state, dispatch } = useContext(TodoContext);
  const todoListRowSelection = {
    onSelect: async (record: TodoType) => {
      try {
        // 更新状态
        await ipcRenderer.invoke('updateTodo', record.id, {
          status: 1,
        });
        const newKeys = [...state.selectedFinishedRowsKeys, record.id];
        const newTodoList = state.todoListData.filter(
          (item) => item.id !== record.id
        );
        const newFinishedList = state.finishedListData.concat(record);
        dispatch({ type: 'setSelectedFinishedRowsKeys', value: newKeys });
        dispatch({ type: 'setTodoListData', value: newTodoList });
        dispatch({ type: 'setFinishedListData', value: newFinishedList });

        // 更新分类
        const classifyCount = await ipcRenderer.invoke('countTodo');
        dispatch({ type: 'setClassifyCount', value: classifyCount });
      } catch (error) {
        console.log('Change todo status to "finished" error: ', error);
      }
    },
    selectedRowKeys: [],
  };
  const finishedListRowSelection = {
    onSelect: async (record: TodoType) => {
      try {
        // 更新状态
        await ipcRenderer.invoke('updateTodo', record.id, {
          status: 0,
        });
        const newTodoList = state.todoListData.concat(record);
        const newFinishedList = state.finishedListData.filter(
          (item) => item.id !== record.id
        );
        dispatch({ type: 'setFinishedListData', value: newFinishedList });
        dispatch({ type: 'setTodoListData', value: newTodoList });

        // 更新分类
        const classifyCount = await ipcRenderer.invoke('countTodo');
        dispatch({ type: 'setClassifyCount', value: classifyCount });
      } catch (error) {
        console.log('Change todo status to "todo" error: ', error);
      }
    },
    selectedRowKeys: state.selectedFinishedRowsKeys,
  };

  // ****** rerender 刷新 table 可滚动高度 ******
  const textRef = useRef<HTMLHeadingElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const handleScrollH = () => {
    const tableH = tableRef.current?.clientHeight || 0;
    const textH = textRef.current?.clientHeight || 0;
    const scrollH = tableH - textH;
    if (scrollH) {
      dispatch({ type: 'setTableScrollH', value: scrollH });
    }
  };
  // 初始化 table 高度
  useEffect(() => {
    handleScrollH();
  }, []);
  // 窗口变化时刷新高度
  useResize(() => {
    handleScrollH();
  }, []);
  // ****** rerender 刷新 table 可滚动高度 ******

  const getTodoList = async () => {
    try {
      const { actived } = todoListProps;
      if (!actived.type) return;
      const query = {} as Partial<TodoType>;
      if (actived.type === 'date') {
        query.date = actived.value;
      } else if (actived.type === 'classify') {
        query.classify = actived.value;
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
    } catch (error) {
      console.log('Get todo list error: ', error);
    }
  };

  // ****** 初始化数据 ******
  useDeepCompareEffect(() => {
    (async () => {
      await getTodoList();
    })();
  }, [todoListProps]);
  // ****** 初始化数据 ******

  const renderDesc = (record: TodoType) => {
    return <TodoDetail todoId={record.id} />;
  };

  const renderTable = (tableInfo: TodoTableType) => {
    const { tableData, rowSelection } = tableInfo;

    const handleDelete = async (record: TodoType) => {
      const { id } = record;
      try {
        // 删除记录
        await ipcRenderer.invoke('deleteTodo', id);
      } catch (error) {
        console.log('Delete todo error: ', error);
      }
      // 重新获取数据
      try {
        // 获取数据
        await getTodoList();

        // 更新日历
        let todoDate = await ipcRenderer.invoke(
          'getTodoDays',
          moment(state.currentMonth).year(),
          moment(state.currentMonth).month() + 1
        );
        todoDate = todoDate.map((date: Partial<TodoType>) =>
          moment(date.dateTimestamp).format('YYYY-MM-DD')
        );
        dispatch({
          type: 'setTodoDays',
          value: [...new Set(todoDate)] as string[],
        });

        // 更新分类
        const classifyCount = await ipcRenderer.invoke('countTodo');
        dispatch({ type: 'setClassifyCount', value: classifyCount });
      } catch (error) {
        console.log('Get TodoDays error: ', error);
      }
    };

    const showDeleteConfirm = (record: TodoType) => {
      confirm({
        title: '删除确认',
        icon: <ExclamationCircleOutlined />,
        centered: true,
        content: (
          <p>
            开发者懒得做回收站，更懒得偷偷保留数据。
            <br />
            所以<span style={{ color: '#E44259' }}>删除后不可恢复！</span>
            想清楚了吗？
          </p>
        ),
        okText: '删除',
        cancelText: '取消',
        onOk() {
          handleDelete(record);
        },
      });
    };

    return (
      <Table
        size="small"
        rowKey="id"
        dataSource={tableData}
        showHeader={false}
        pagination={false}
        scroll={{ y: state.tableScrollH }}
        expandable={{
          expandedRowRender: (record) => renderDesc(record),
          rowExpandable: () => true,
        }}
        rowSelection={rowSelection}
      >
        <Column
          key="title"
          dataIndex="title"
          render={(title, record: TodoType) => (
            <LineWrapper>
              {title}
              <IconWrapper>
                {/* // todo feat: 补充提醒功能 */}
                {/* <CalendarOutlined style={{ color: '#F07E4A' }} /> */}
                <DeleteOutlined
                  style={{ color: '#E44259' }}
                  onClick={() => showDeleteConfirm(record)}
                />
              </IconWrapper>
            </LineWrapper>
          )}
        />
      </Table>
    );
  };

  return (
    <TodoListWrapper>
      <TableWrapper ref={tableRef}>
        <h3 ref={textRef}>未完成</h3>
        {renderTable({
          tableData: state.todoListData,
          rowSelection: todoListRowSelection,
        })}
      </TableWrapper>
      <TableWrapper>
        <h3>已完成</h3>
        {renderTable({
          tableData: state.finishedListData,
          rowSelection: finishedListRowSelection,
        })}
      </TableWrapper>
    </TodoListWrapper>
  );
}
