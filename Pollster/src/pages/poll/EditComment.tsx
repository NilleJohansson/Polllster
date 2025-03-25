import { Button, TextField } from "@mui/material";
import React, { useState } from "react";

function EditComment({ comment, cancelEditComment, saveCommentEdit }) {
  const [editComment, setEditComment] = useState(comment);

  return (
    <div className="flex flex-col gap-2 w-full">
      <TextField
        multiline
        rows={2}
        className="w-full"
        value={editComment}
        onChange={(e) => setEditComment(e.target.value)}
      />
      <div className="flex items-start gap-2">
                  <Button variant="contained"
    color="primary" onClick={() => saveCommentEdit(editComment)}>Save</Button>
                <Button variant="contained"
    color="primary" onClick={cancelEditComment}>Cancel</Button>
    </div>
    </div>
  );
}

export default EditComment;
