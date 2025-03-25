import Button from '@mui/material/Button'
import React from 'react'
import CheckIcon from '@mui/icons-material/Check';
import styles from './VoteAddedDialog.module.css'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ShareIcon from '@mui/icons-material/Share';

function VoteAddedDialog({showResult, hideShareButton}) {
  return (
    <div className='flex flex-col items-center'>
      <div className={styles.circle}>
    <CheckIcon style={{ color: 'green' }}  />
    </div>
    <h3 className='mt-3'>Vote successful</h3>
    <p className='mt-2'>Thank you for participating in this poll. Your vote has been counted.</p>
    <div className='flex justify-between mt-4 min-w-full'>
    <Button
          onClick={showResult}
          variant="contained"
          color="primary"
        >
          <SignalCellularAltIcon />
          Results
        </Button>
        { !hideShareButton && 
        <Button  variant="greyVariant" color="secondary"
    ><ShareIcon /> Share</Button>
        }
    </div>
  </div>
  )
}

export default VoteAddedDialog