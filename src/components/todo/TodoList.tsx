import React, { useEffect, useState, useRef } from 'react';
import { Table } from 'antd';
import { DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import {
  LineWrapper,
  IconWrapper,
  TodoListWrapper,
  TableWrapper,
} from '../../style/todo.style';
import { TodoMeta } from '../../typings/todo';
import Editor from '../Editor';

const { Column } = Table;

const renderDesc = (record: TodoMeta) => {
  return <Editor initValue={record.desc} />;
};

const finishedList: TodoMeta[] = [];

const targetList = [
  {
    key: 1,
    title: '任务1',
    desc: '这是任务1',
    alarm: '',
  },
  {
    key: 2,
    title: '任务2',
    desc: '这是任务2',
    alarm: '',
  },
  {
    key: 3,
    title: '任务3',
    desc: '这是任务3',
    alarm: '',
  },
  {
    key: 4,
    title: '任务4',
    desc: '这是任务4',
    alarm: '',
  },
  {
    key: 5,
    title: '任务5',
    desc: '这是任务5',
    alarm: '',
  },
  {
    key: 6,
    title: '任务6',
    desc: '这是任务6',
    alarm: '',
  },
  {
    key: 7,
    title: '任务7',
    desc: '这是任务7',
    alarm: '',
  },
  {
    key: 8,
    title: '任务8',
    desc: '这是任务8',
    alarm: '',
  },
  {
    key: 9,
    title: '任务9',
    desc: '这是任务9',
    alarm: '',
  },
  {
    key: 10,
    title: '任务10',
    desc: '这是任务10',
    alarm: '',
  },
  {
    key: 11,
    title: '任务11',
    desc: '这是任务11',
    alarm: '',
  },
  {
    key: 12,
    title: '任务12',
    desc: '这是任务12',
    alarm: '',
  },
  {
    key: 13,
    title: '任务13',
    desc: '这是任务13',
    alarm: '',
  },
  {
    key: 14,
    title: '任务14',
    desc: '这是任务14',
    alarm: '',
  },
];

export default function TodoList() {
  const textRef = useRef<HTMLHeadingElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableScrollH, setTableScrollH] = useState(0);
  useEffect(() => {
    const tableH = tableRef.current?.offsetHeight || 0;
    const textH = textRef.current?.offsetHeight || 0;
    const scrollH = tableH - textH;
    setTableScrollH(scrollH);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      const tableH = tableRef.current?.clientHeight || 0;
      const textH = textRef.current?.clientHeight || 0;
      const scrollH = tableH - textH;
      setTableScrollH(scrollH);
    });
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  const [targetListData, setTargetListData] = useState([] as TodoMeta[]);
  const [finishedListData, setFinishedListData] = useState([] as TodoMeta[]);
  const [selectedFinishedRowsKeys, setSelectedFinishedRowsKeys] = useState(
    [] as (string | number)[]
  );
  useEffect(() => {
    setTargetListData(targetList);
  }, []);
  useEffect(() => {
    setFinishedListData(finishedList);
  }, []);

  const targetListRowSelection = {
    onSelect: (record: TodoMeta) => {
      setSelectedFinishedRowsKeys((prevKeys) => {
        return [...prevKeys, record.key];
      });
      setTargetListData((prevList) => {
        return prevList.filter((item) => item.key !== record.key);
      });
      setFinishedListData((prevList) => {
        return prevList.concat(record);
      });
    },
    selectedRowKeys: [],
  };

  const finishedListRowSelection = {
    onSelect: (record: TodoMeta) => {
      setFinishedListData((prevList) => {
        return prevList.filter((item) => item.key !== record.key);
      });
      setTargetListData((prevList) => {
        return prevList.concat(record);
      });
    },
    selectedRowKeys: selectedFinishedRowsKeys,
  };

  return (
    <TodoListWrapper>
      <TableWrapper ref={tableRef}>
        <h3 ref={textRef}>未完成</h3>
        <Table
          size="small"
          dataSource={targetListData}
          showHeader={false}
          pagination={false}
          expandable={{
            expandedRowRender: renderDesc,
            rowExpandable: () => true,
          }}
          scroll={{ y: tableScrollH }}
          rowSelection={targetListRowSelection}
        >
          <Column
            key="title"
            dataIndex="title"
            render={(title) => (
              <LineWrapper>
                {title}
                <IconWrapper>
                  <CalendarOutlined style={{ color: '#F07E4A' }} />
                  <DeleteOutlined style={{ color: '#E44259' }} />
                </IconWrapper>
              </LineWrapper>
            )}
          />
        </Table>
      </TableWrapper>
      <TableWrapper>
        <h3>已完成</h3>
        <Table
          size="small"
          scroll={{ y: tableScrollH }}
          dataSource={finishedListData}
          showHeader={false}
          pagination={false}
          expandable={{
            expandedRowRender: renderDesc,
            rowExpandable: () => true,
          }}
          rowSelection={finishedListRowSelection}
        >
          <Column
            key="title"
            dataIndex="title"
            render={(title) => (
              <LineWrapper>
                {title}
                <IconWrapper>
                  <CalendarOutlined style={{ color: '#F07E4A' }} />
                  <DeleteOutlined style={{ color: '#E44259' }} />
                </IconWrapper>
              </LineWrapper>
            )}
          />
        </Table>
      </TableWrapper>
    </TodoListWrapper>
  );
}
