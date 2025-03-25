import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { MultiChoiceType } from "./MultiChoiceType";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";

const classes = {
  draggingListItem: {
    background: "rgb(235,235,235)",
  },
};

export type DraggableListItemProps = {
  multiChoiceOption: MultiChoiceType;
  index: number;
  deleteItem: (index: number) => void;
  editOptionValue: (optionValue: string, index: number) => void;
  onEnter?: () => void;
};

const DraggableListItem = ({
  multiChoiceOption,
  index,
  deleteItem,
  editOptionValue,
  onEnter,
}: DraggableListItemProps) => {
  console.log("Set focus", multiChoiceOption.setFocus);
  return (
    <Draggable
      draggableId={multiChoiceOption.id}
      index={index}
      isDragDisabled={multiChoiceOption.isOtherOption}
      isDropDisabled={multiChoiceOption.isOtherOption}
    >
      {(provided, snapshot) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={snapshot.isDragging ? classes.draggingListItem : ""}
        >
          <div className="min-w-full">
            <TextField
              id="outlined-basic"
              variant="outlined"
              InputLabelProps={{ shrink: false }}
              fullWidth
              hiddenLabel
              value={multiChoiceOption.option}
              disabled={multiChoiceOption.isOtherOption}
              autoFocus
              focused={multiChoiceOption.setFocus ? multiChoiceOption.setFocus : false}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                editOptionValue(event.target.value, index);
              }}
              onBlur={() => multiChoiceOption.setFocus = false}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (onEnter) {
                    onEnter();
                  }
                }
              }}
              placeholder={
                multiChoiceOption.isOtherOption
                  ? "Other..."
                  : `Option ${index + 1}`
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CloseIcon
                      className="cursor-pointer"
                      onClick={() => deleteItem(index)}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </ListItem>
      )}
    </Draggable>
  );
};

export default DraggableListItem;
