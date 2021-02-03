import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import List from './List';
import { TodoCardType } from '../../typings/dashboard';
import {
  TodoPanelWrapper,
  TodoPanelTitle,
  TodoPanelList,
} from './dashboard.style';

const mockTodoCardData = [
  {
    id: '1',
    title: '这是一个超级超级超级超级长的标题',
    desc:
      'Text 1Text 1Text 1Text 1Text 1Text 1Text 1Text 1Text 1Text 1Text 1Text 1Text 1Text 1Text 1Text 1',
    finished: false,
  },
  {
    id: '2',
    title: '任务2',
    desc: 'Text 2',
    finished: true,
  },
  {
    id: '3',
    title: '任务3',
    desc: 'Text 3',
    finished: false,
  },
  {
    id: '4',
    title: '任务4',
    desc: 'Text 4',
    finished: false,
  },
  {
    id: '5',
    title: '任务5',
    desc: 'Text 5',
    finished: true,
  },
  {
    id: '6',
    title: '任务6',
    desc: 'Text 6',
    finished: true,
  },
  {
    id: '7',
    title: '任务7',
    desc: 'Text 7',
    finished: false,
  },
];

const reorder = (
  list: TodoCardType[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function DraggablePanel() {
  const [todoCardData, setTodoCardData] = useState(mockTodoCardData);

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const orderList = reorder(
      todoCardData,
      result.source.index,
      result.destination.index
    );

    setTodoCardData(orderList);
  }

  return (
    <TodoPanelWrapper>
      <TodoPanelTitle>今日目标</TodoPanelTitle>
      <TodoPanelList>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="todo-card-list">
            {(provided) => {
              return (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <List list={todoCardData} />
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
      </TodoPanelList>
    </TodoPanelWrapper>
  );
}
