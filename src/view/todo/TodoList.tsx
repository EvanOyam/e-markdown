import React, { useEffect, useRef, useContext, useState } from 'react';
import { Table, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { TodoListProps, TodoMeta, TodoTableType } from '../../typings/todo';
import Editor from '../../components/Editor';
import useResize from '../../hooks/useResize';
import { TodoContext } from '../../context/todoContext';

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
  const { type, value } = todoListProps.actived;
  const { state, dispatch } = useContext(TodoContext);
  const todoListRowSelection = {
    onSelect: async (record: TodoMeta) => {
      try {
        const storeTodoData: TodoMeta = await ipcRenderer.invoke(
          'getStoreValue',
          `todo.data.${record.id}`
        );
        storeTodoData.status = 1;
        await ipcRenderer.invoke(
          'setStoreValue',
          `todo.data.${record.id}`,
          storeTodoData
        );
        const newKeys = [...state.selectedFinishedRowsKeys, record.id];
        const newTodoList = state.todoListData.filter(
          (item) => item.id !== record.id
        );
        const newFinishedList = state.finishedListData.concat(record);
        dispatch({ type: 'setSelectedFinishedRowsKeys', value: newKeys });
        dispatch({ type: 'setTodoListData', value: newTodoList });
        dispatch({ type: 'setFinishedListData', value: newFinishedList });
      } catch (error) {
        console.log('Change todo status to "finished" error: ', error);
      }
    },
    selectedRowKeys: [],
  };
  const finishedListRowSelection = {
    onSelect: async (record: TodoMeta) => {
      try {
        const storeTodoData: TodoMeta = await ipcRenderer.invoke(
          'getStoreValue',
          `todo.data.${record.id}`
        );
        storeTodoData.status = 0;
        await ipcRenderer.invoke(
          'setStoreValue',
          `todo.data.${record.id}`,
          storeTodoData
        );
        const newTodoList = state.todoListData.concat(record);
        const newFinishedList = state.finishedListData.filter(
          (item) => item.id !== record.id
        );
        dispatch({ type: 'setFinishedListData', value: newFinishedList });
        dispatch({ type: 'setTodoListData', value: newTodoList });
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
  });
  // ****** rerender 刷新 table 可滚动高度 ******

  // ****** 初始化数据 ******
  useDeepCompareEffect(() => {
    (async () => {
      try {
        const todoIndex = await ipcRenderer.invoke(
          'getStoreValue',
          `todo.${type}Index.${value}`
        );
        // 不存在索引，清空数据
        if (!todoIndex) {
          dispatch({ type: 'setSelectedFinishedRowsKeys', value: [] });
          dispatch({ type: 'setTodoListData', value: [] });
          dispatch({ type: 'setFinishedListData', value: [] });
          return;
        }
        const todoListPromise = [];
        for await (const id of todoIndex) {
          const todoData = ipcRenderer.invoke(
            'getStoreValue',
            `todo.data.${id}`
          );
          if (todoData) todoListPromise.push(todoData);
        }
        // 过滤 undefined ，筛选词，或其他异常数据
        const storeTodoList = (await Promise.all(todoListPromise)).filter(
          (item: TodoMeta) => {
            if (state.filterText) {
              return (
                item &&
                item.status === 0 &&
                item.title.indexOf(state.filterText) !== -1
              );
            }
            return item && item.status === 0;
          }
        );
        const storeFinishedList = (await Promise.all(todoListPromise)).filter(
          (item: TodoMeta) => {
            if (state.filterText) {
              return (
                item &&
                item.status === 1 &&
                item.title.indexOf(state.filterText) !== -1
              );
            }
            return item && item.status === 1;
          }
        );
        const finishedListKeys = storeFinishedList.map((record) => record.id);
        dispatch({
          type: 'setSelectedFinishedRowsKeys',
          value: finishedListKeys,
        });
        dispatch({ type: 'setTodoListData', value: storeTodoList });
        dispatch({
          type: 'setFinishedListData',
          value: storeFinishedList,
        });
      } catch (error) {
        console.log('Initialization todo list error: ', error);
      }
    })();
  }, [todoListProps, state.filterText]);
  // ****** 初始化数据 ******

  // todo feat: save
  const renderDesc = (record: TodoMeta) => {
    return <Editor mdPath={record.path} handleChange={() => {}} />;
  };

  const renderTable = (tableInfo: TodoTableType) => {
    const { tableData, rowSelection } = tableInfo;

    const handleDelete = async (record: TodoMeta) => {
      const { id, status } = record;
      try {
        // 删除持久化记录
        const todoPath = path.join(__dirname, '..', 'assets', 'docs', 'todo');
        const mdPath = path.join(todoPath, `${id}.md`);
        await fs.promises.unlink(mdPath);
        await ipcRenderer.invoke('delStoreValue', `todo.data.${id}`);
        // 更新视图列表
        const newList =
          status === 0
            ? state.todoListData.filter((data) => data.id !== id)
            : state.finishedListData.filter((data) => data.id !== id);
        const action = status === 0 ? 'setTodoListData' : 'setFinishedListData';
        dispatch({ type: action, value: newList });
        // 如果是已完成的 list，还需要更新 keys 列表
        if (status === 1) {
          const newKeys = state.selectedFinishedRowsKeys.filter(
            (key) => key !== record.id
          );
          dispatch({ type: 'setSelectedFinishedRowsKeys', value: newKeys });
        }
      } catch (error) {
        console.log('Delete todo error: ', error);
      }
    };

    const showDeleteConfirm = (record: TodoMeta) => {
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
          render={(title, record: TodoMeta) => (
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
