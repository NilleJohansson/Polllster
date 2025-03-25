import { Button, TextField } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'

function ReplyComment({hideReplyInput, saveReply, initialComment}) {
  const [replyComment, setReplyComment] = useState(initialComment);
  const replyRef = useRef<HTMLInputElement | null>(null); 

  useEffect(() => {
    if (replyRef.current) {
      replyRef.current.focus();

      const length = replyComment.length;
      replyRef.current.setSelectionRange(length, length);
    }
  }, []); 

  return (
    <div className="flex flex-col gap-2 w-full">
      <TextField
        multiline
        rows={2}
        className="w-full"
        value={replyComment}
        onChange={(e) => setReplyComment(e.target.value)}
        inputRef={replyRef}
      />
      <div className="flex justify-end gap-2">
                <Button variant="contained"
    color="primary" onClick={hideReplyInput}>Cancel</Button>
                  <Button variant="contained"
    color="primary" onClick={() => saveReply(replyComment)}>Reply</Button>
    </div> 
    </div>  )
}

export default ReplyComment