import React from 'react'
import styles from './PollListItem.module.css';
import moment from 'moment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { formatToDDMMYYY } from '../../utils/DateAndTimeUtils';

function PollListItem({onClick, poll}) {
  console.log("Original time", poll?.createTime);

  const dateTime = formatToDDMMYYY(poll?.createTime);
  console.log("Poll create time", dateTime);
  
  // const formattedCreationDate = dateTime.format('MMMM D, YYYY');

  // console.log("Formatted date", formattedCreationDate);
  

  const voteAmount: number = poll?.votingOptions?.reduce((total, item) => total + item['voteAmount'], 0);

  return (
    <div onClick={onClick} className={styles.container}>
        <div className='text-white flex flex-col ml-3'><span>{poll.title}</span><span>{dateTime}</span></div>
        <p className='flex justify-center items-center'>{voteAmount}</p>
        <p className='flex justify-center items-center'>-</p>
        <p className='flex justify-center items-center'><span className={styles.liveStatus}>· Live</span></p>
        <p className='flex justify-center items-center'><MoreHorizIcon className={styles.moreActionsIcon}/></p>
    </div>
  )
}

export default PollListItem