import Card from '@mui/material/Card'
import React, { useEffect, useState } from 'react'
import styles from "./PollComments.module.css";
import ForumIcon from '@mui/icons-material/Forum';
import Divider from '@mui/material/Divider';
import ErrorIcon from '@mui/icons-material/Error';
import Alert from '@mui/material/Alert';
import useAuth from '../../context/useAuth';
import { Button, TextField } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import "../../styles/styles.css";
import PollComment from './PollComment';
import useApiClient from '../../api/ApiClient';
import { AddCommentRequest } from '../../api/requests/AddCommentRequest';
import { EditCommentRequest } from '../../api/requests/EditReplyRequest';
import { AddReplyRequest } from '../../api/requests/AddReplyRequest';
import { EditReplyRequest } from '../../api/requests/EditReplyRequest';
import { useAlert } from '../../context/useAlert';
import { hasProfaneLanguage } from '../../utils/LanguageFilter';

function PollComments({ poll }) {
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [currentPoll, setPoll] = useState(poll);
  const pollAPI = useApiClient("http://localhost:8080/api/poll/");

  const profaneLanguageResponse: string = "Oops! It looks like your comment contains inappropriate language. Please keep it respectful!";

  useEffect(() => {
    setPoll(poll)
  }, [poll]);

  async function addComment() {
    if (comment.trim().length == 0) {
      console.log("Popup with error of empty comment");
    }

    if (hasProfaneLanguage(comment)) {
      showAlert(profaneLanguageResponse, "warning", 4000);
      return;
    }

    const commentRequest : AddCommentRequest = {
      email: user?.email as string,
      pollID: poll.id,
      comment: comment.trim()
    };

    try {
      const addedComment = await pollAPI.post("addcomment",
        commentRequest, 
        {
        headers: { Authorization: `Bearer ${user?.accessToken}`
      }});

      showAlert('Successfully created.', "success")

      setPoll(prevPoll => ({
        ...prevPoll,
        comments: [...(prevPoll.comments), addedComment.data], 
      }));
      
      setComment('');
      
    } catch (err) {
      // TODO: Handle and show graceful error
      console.log(err);
      return;
    }
  }

  async function deleteReply(commentID: string, replyID: string) {
    try {
      await pollAPI.del("deletereply/" + commentID + "/" + replyID,
        {
        headers: { Authorization: `Bearer ${user?.accessToken}`
      }});

      showAlert('Successfully deleted.', "success")
      
      setPoll(prevPoll => ({
        ...prevPoll,
        comments: prevPoll.comments.map(existingComment =>
          existingComment.id === commentID
            ? {
                ...existingComment,
                replies: existingComment.replies.filter(existingReply => existingReply.id !== replyID)
              }
            : existingComment
        )
      }));
      
    } catch (err) {
      // TODO: Handle and show graceful error
      console.log(err);
      return;
    }
  }

  async function deleteComment(commentID: string, originalCommentID: string) {
    const isForReply: boolean =  commentID !== originalCommentID;
    if (isForReply) {
      await deleteReply(originalCommentID, commentID);
      return;
    }

    if (commentID.trim().length == 0) {
      // TODO: Show error
      console.log("Show error");
    }

    try {
      await pollAPI.del("deletecomment/" + commentID,
        {
        headers: { Authorization: `Bearer ${user?.accessToken}`
      }});

      showAlert('Successfully deleted.', "success");

      setPoll(prevPoll => ({
        ...prevPoll,
        comments: [...prevPoll.comments.filter(comment => comment.id !== commentID)], 
      }));
   
      
    } catch (err) {
      // TODO: Handle and show graceful error
      console.log(err);
      return;
    }
  }

  async function saveCommentEdit(commentID: string, comment: string): boolean {
    console.log("Save comment edit", commentID, comment);

    if (hasProfaneLanguage(comment)) {
      showAlert(profaneLanguageResponse, "warning", 4000);
      return false;
    }

    const editCommentRequest : EditCommentRequest = {
      commentID,
      comment
    };

    try {
      await pollAPI.put("updatecomment",
        editCommentRequest, 
        {
        headers: { Authorization: `Bearer ${user?.accessToken}`
      }});

      showAlert('Successfully updated.', "success");

      setPoll((prevPoll) => ({
        ...prevPoll,
        comments: prevPoll.comments.map((existingComment) =>
          existingComment.id === commentID
            ? { ...existingComment, comment: comment }
            : existingComment
        ),
      }));    
      return true;
    } catch (err) {
      // TODO: Handle and show graceful error
      console.log(err);
      return false;
    }
  }

  async function saveReplyEdit(replyID: string, reply: string, commentID: string): boolean {
    const editReplyRequest : EditReplyRequest = {
      replyID,
      reply
    };

    if (hasProfaneLanguage(comment)) {
      showAlert(profaneLanguageResponse, "warning", 4000);
      return false;
    }

    try {
      await pollAPI.put("updatereply",
        editReplyRequest, 
        {
        headers: { Authorization: `Bearer ${user?.accessToken}`
      }});

      showAlert('Successfully updated.', "success");

      setPoll((prevPoll) => ({
        ...prevPoll,
        comments: prevPoll.comments.map((existingComment) =>
          existingComment.id === commentID
            ? {
                ...existingComment,
                replies: existingComment.replies.map((existingReply) =>
                  existingReply.id === replyID
                    ? {
                        ...existingReply,
                        comment: reply,
                      }
                    : existingReply
                ),
              }
            : existingComment
        ),
      }));
      
      return true;
    } catch (err) {
      // TODO: Handle and show graceful error
      console.log(err);
      return false;
    }
  }

  async function saveReply(reply: string, pollID: string, commentID: string): Promise<boolean> {
    if (reply.trim().length == 0) {
      // TODO: Show error message
      console.log("Handle error");
    }

    if (hasProfaneLanguage(comment)) {
      showAlert(profaneLanguageResponse, "warning", 4000);
      return false;
    }

    const replyRequest: AddReplyRequest = {
      email: user?.email as string,
      pollID,
      commentID,
      comment: reply
    }

    try {
      const addedReply = await pollAPI.post("addreply",
        replyRequest,
        {
        headers: { Authorization: `Bearer ${user?.accessToken}`
      }});
      
      showAlert('Successfully created.', "success");

      setPoll(prevPoll => ({
        ...prevPoll,
        comments: prevPoll.comments.map(c => {
          if (c.id === commentID) {
            return {
              ...c,
              replies: [...(c.replies || []), addedReply.data], 
            };
          }
          return c;
        }),
      }));

      return true;
      
    } catch (err) {
      // TODO: Handle and show graceful error
      console.log(err);
      return false;
    }
  }

  function renderComments() {    
    console.log("Render comments", currentPoll);
    
    if (!currentPoll?.settings?.allowComments) {
      return <section className='flex p-5 gap-2'>
      <p>Comments are disabled.</p>
  </section>
    } else {
      let commentsRender;

      if (currentPoll.comments && currentPoll.comments.length > 0) {
        commentsRender = currentPoll.comments.map((pollComment) => {
         return <PollComment key={pollComment.id} comment={pollComment} onDelete={deleteComment} 
         saveCommentEdit={saveCommentEdit} saveReply={saveReply} mainCommentID={pollComment.id}
         saveReplyEdit={saveReplyEdit} />
        })
      } else {
        commentsRender =  (
        <p className='w-full rounded bg-[#26364B] p-3 flex items-center'><ErrorIcon className='mr-2 text-lg' style={{ color: '#60A5FA' }} />No comments yet. Be the first to write one!</p> 
        );
      }
    return <div><section className='flex p-7 gap-6 flex flex-col'>
        { commentsRender }
      </section>
      <Divider className='!w-100'/>
      <section className='flex p-7 gap-2 flex flex-col'>
        <div className='flex flex w-full gap-2'>
      <span className='user-icon'>{user?.username?.charAt(0).toUpperCase()}</span>
        <TextField
           multiline
           className='w-full'
           rows={3}
           value={comment}
           placeholder="Add a comment"
           onChange={(e) => setComment(e.target.value)}
           />
           </div>
           <div className='flex items-center'>
           <p className='pl-10'><HelpIcon className='text-lg mr-2' />HTML and links are not allowed.</p>
            <Button variant="contained"
    color="primary" className='mt-2 ml-auto' onClick={addComment}>Add comment</Button>
    </div>
      </section>
      </div>
    }
  }

  return (
    <div className="flex flex-col mt-10 items-center">
    <Card sx={{
        minWidth: 600,
        maxWidth: 1500,
      }}>
        <header className='flex p-5 gap-2'>
        <ForumIcon style={{ color: '#94A3B8' }} />
        <h4>Comments</h4>
        </header>
        <Divider className='!w-100'/>
        { renderComments() }
      </Card>
      </div>
  )
}

export default PollComments