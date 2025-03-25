import React, { useState } from 'react'
import useAuth from '../../context/useAuth';
import EditComment from './EditComment';
import ReplyComment from './ReplyComment';
import { formatDistanceToNow } from 'date-fns';
import { getTimeFromEvent } from '../../utils/DateAndTimeUtils';

function PollComment({ comment, onDelete, saveCommentEdit, saveReply, mainCommentID,
    saveReplyEdit
 }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isReply, setIsReply] = useState(false);

    const { user } = useAuth();
    
    function replyToComment() {
      setIsReply(true);   
    }

    function editComment() {
      setIsEditing(true);
    }

    function hideEditComment() {      
      setIsEditing(false);
    }

    function hideReplyInput() {
      setIsReply(false);
    }

    async function saveEdit(editedComment: string) {
        let isEdited: boolean = false;
        const isForReply: boolean = comment.id !== mainCommentID;

        if (isForReply) {
          isEdited = saveReplyEdit(comment.id, editedComment, mainCommentID);
        } else {
          isEdited = saveCommentEdit(comment.id, editedComment);
        }
        
        if (isEdited) {
          setIsEditing(false);
        }
    }

    async function storeReply(reply: string) {
        const replyAdded: boolean = saveReply(reply, comment.pollID, mainCommentID);
        if (replyAdded) {
          setIsReply(false);
        }
    }

    function commentIsFromActiveUser(): boolean {
      return comment.user.email === user?.email;
    }

      return (
    <div className='flex items-start gap-2 w-full'>
    <span className='user-icon mt-1'>{user?.username?.charAt(0).toUpperCase()}</span>
    <div className='w-full'>
    <p className='text-white'>Niklas</p>
    {isEditing ? <EditComment comment={comment.comment} cancelEditComment={hideEditComment} 
        saveCommentEdit={saveEdit} /> :  
    <div className='flex flex-col gap-1'>
        <p className='text-grey'>{comment.comment}</p> 
        <div className='flex gap-3'><span className='text-gray-400'>{ getTimeFromEvent(comment.createTime) }</span>
        <span className='text-white'>·</span>
         <span className='text-white cursor-pointer' onClick={replyToComment}>Reply</span>
         { commentIsFromActiveUser() && (
          <>
         <span className='text-white'>·</span>
         <span className='text-white cursor-pointer' onClick={editComment}>Edit</span>
         <span className='text-white'>·</span>
         <span className='text-white cursor-pointer' onClick={() => onDelete(comment.id, mainCommentID)}>Delete</span>
         </>
        )}
         </div>
    </div>
    }
    <div className='flex flex-col gap-1 mt-3'>
      { comment?.replies?.map(r => {
        return <PollComment key={r.id} comment={r} 
        onDelete={onDelete} mainCommentID={comment.id}
                 saveCommentEdit={saveCommentEdit} saveReply={saveReply}
                saveReplyEdit={saveReplyEdit} />
      }) }
    </div>
    {isReply && <ReplyComment hideReplyInput={hideReplyInput} saveReply={storeReply}
          initialComment={comment.id !== mainCommentID ? `@${comment.user.username} ` : ''} />}
    </div>
    </div>
  )
}

export default PollComment