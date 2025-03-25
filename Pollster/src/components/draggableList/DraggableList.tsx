import * as React from 'react';
import DraggableListItem from './DraggableListItem';
import {
  DragDropContext,
  OnDragEndResponder
} from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';
import { MultiChoiceType } from './MultiChoiceType';

export type DraggableListProps = {
  multiChoiceOptions: MultiChoiceType[];
  onDragEnd: OnDragEndResponder;
  deleteItem: (index: number) => void
  editOptionValue: (optionValue: string, index: number) => void;
  onEnter?: () => void;
};

const DraggableList = React.memo(({ multiChoiceOptions, onDragEnd, deleteItem, editOptionValue, onEnter }: DraggableListProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="droppable-list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {multiChoiceOptions.map((multiChoiceOption, index) => (
              <DraggableListItem multiChoiceOption={multiChoiceOption} 
              index={index} 
              key={multiChoiceOption.id}
              deleteItem={() => deleteItem(index)}
              editOptionValue={editOptionValue}
              onEnter={onEnter}
             />
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
});

export default DraggableList;
