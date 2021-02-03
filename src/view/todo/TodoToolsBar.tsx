import React from 'react';
import { PageHeader, Input } from 'antd';
import { PlusOutlined, QuestionOutlined } from '@ant-design/icons';
import { ToolsBarActionWrapper } from './todo.style';

const { Search } = Input;

interface TodoToolsBarProps {
  title: string;
  todoCount: number;
}

export default function TodoToolsBar(props: TodoToolsBarProps) {
  const { title, todoCount } = props;
  const onSearch = (value: string) => {
    return value;
  };
  return (
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
          <PlusOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
          <QuestionOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
        </ToolsBarActionWrapper>
      }
    />
  );
}
