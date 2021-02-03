import React, { memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card } from 'antd';
import { CheckCircleTwoTone, QuestionCircleTwoTone } from '@ant-design/icons';
import { TodoCardListType } from '../../typings/dashboard';
import { CardWrapper } from './dashboard';

const renderIcon = (finished: boolean) => {
  return finished ? (
    <CheckCircleTwoTone style={{ fontSize: '22px' }} twoToneColor="#4CAF4F" />
  ) : (
    <QuestionCircleTwoTone
      style={{ fontSize: '22px' }}
      twoToneColor="#ff6720"
    />
  );
};

const List = (props: TodoCardListType) => {
  const { list } = props;
  return (
    <>
      {list.map((card, index: number) => (
        <Draggable draggableId={card.id} index={index} key={card.id}>
          {(provided) => {
            return (
              <CardWrapper
                ref={provided.innerRef}
                finished={card.finished}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <Card
                  type="inner"
                  title={card.title}
                  extra={renderIcon(card.finished)}
                >
                  {card.desc}
                </Card>
              </CardWrapper>
            );
          }}
        </Draggable>
      ))}
    </>
  );
};
const ListMemo = memo(List);

export default ListMemo;
