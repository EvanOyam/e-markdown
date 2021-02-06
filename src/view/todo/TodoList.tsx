import React, { useEffect, useRef, useContext, useState } from 'react';
import { Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';
import moment from 'moment';
import { TodoMeta, TodoTableType } from '../../typings/todo';
import Editor from '../../components/Editor';
import useResize from '../../hooks/useResize';
import { TodoContext } from '../../context/todoContext';

const { Column } = Table;

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

const renderDesc = (record: TodoMeta) => {
  return <Editor textValue="" handleChange={() => {}} />; // todo
};

const renderTable = (props: TodoTableType) => {
  const { tableData, scrollH, rowSelection, loading } = props;
  return (
    <Table
      size="small"
      rowKey="id"
      dataSource={tableData}
      showHeader={false}
      pagination={false}
      loading={loading}
      scroll={{ y: scrollH }}
      expandable={{
        expandedRowRender: renderDesc,
        rowExpandable: () => true,
      }}
      rowSelection={rowSelection}
    >
      <Column
        key="title"
        dataIndex="title"
        render={(title) => (
          <LineWrapper>
            {title}
            <IconWrapper>
              {/* <CalendarOutlined style={{ color: '#F07E4A' }} /> // todo 补充提醒功能 */}
              <DeleteOutlined style={{ color: '#E44259' }} />
            </IconWrapper>
          </LineWrapper>
        )}
      />
    </Table>
  );
};

// todo list 用 memo 渲染
export default function TodoList() {
  const [tableLoading, setTableLoading] = useState(false);
  const { state, dispatch } = useContext(TodoContext);
  const todoListRowSelection = {
    onSelect: (record: TodoMeta) => {
      const newKeys = [...state.selectedFinishedRowsKeys, record.id];
      const newTodoList = state.todoListData.filter(
        (item) => item.id !== record.id
      );
      const newFinishedList = state.finishedListData.concat(record);
      dispatch({ type: 'setSelectedFinishedRowsKeys', value: newKeys });
      dispatch({ type: 'setTodoListData', value: newTodoList });
      dispatch({ type: 'setFinishedListData', value: newFinishedList });
    },
    selectedRowKeys: [],
  };
  const finishedListRowSelection = {
    onSelect: (record: TodoMeta) => {
      const newTodoList = state.todoListData.concat(record);
      const newFinishedList = state.finishedListData.filter(
        (item) => item.id !== record.id
      );
      dispatch({ type: 'setFinishedListData', value: newFinishedList });
      dispatch({ type: 'setTodoListData', value: newTodoList });
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
  useEffect(() => {
    (async () => {
      try {
        setTableLoading(true);
        const dateIndex = await ipcRenderer.invoke(
          'getStoreValue',
          `todo.dateIndex.${moment().format('YYYY-MM-DD')}`
        );
        if (!dateIndex) {
          setTableLoading(false);
          return;
        }
        const todoListPromise = [];
        for await (const id of dateIndex) {
          const todoData = ipcRenderer.invoke(
            'getStoreValue',
            `todo.data.${id}`
          );
          if (todoData) todoListPromise.push(todoData);
        }
        // 过滤 undefined 或其他异常数据
        const storeTodoList = (await Promise.all(todoListPromise)).filter(
          (item: TodoMeta) => item && item.status === 0
        );
        const storeFinishedList = (await Promise.all(todoListPromise)).filter(
          (item: TodoMeta) => item && item.status === 1
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
        setTableLoading(false);
      } catch (error) {
        setTableLoading(false);
        console.log('error: ', error);
      }
    })();
  }, []);
  // ****** 初始化数据 ******

  return (
    <TodoListWrapper>
      <TableWrapper ref={tableRef}>
        <h3 ref={textRef}>未完成</h3>
        {renderTable({
          tableData: state.todoListData,
          scrollH: state.tableScrollH,
          rowSelection: todoListRowSelection,
          loading: tableLoading,
        })}
      </TableWrapper>
      <TableWrapper>
        <h3>已完成</h3>
        {renderTable({
          tableData: state.finishedListData,
          scrollH: state.tableScrollH,
          rowSelection: finishedListRowSelection,
          loading: tableLoading,
        })}
      </TableWrapper>
    </TodoListWrapper>
  );
}
