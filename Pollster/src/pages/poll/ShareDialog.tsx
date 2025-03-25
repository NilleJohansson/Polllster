import { Divider, IconButton, Snackbar, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import React, { useState } from 'react'
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';

function ShareDialog({ url, hideDialog }) {
  const [pollURL, setPollURL] = useState(url);
  const [showCopySnackbar, setShopCopySnackbar] = React.useState(false);


  const handlePollUrlChange = (event) =>  {
    setPollURL(event.target.value);
  }

  const copyToClipboard = async () => {
    console.log("Copy to clipboard");
    
    try {
      await navigator.clipboard.writeText(pollURL);
      setShopCopySnackbar(true);
    } catch (err) {
        console.log(err);
    }
  };

  const handleCloseCopySnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShopCopySnackbar(false);
  };

  return (
    <div>
      <Snackbar
        open={showCopySnackbar}
        autoHideDuration={2000}
        onClose={handleCloseCopySnackbar}
        message="Copied to clipboard"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      />
        <h3>Share via link</h3>
        <p>Use this link to share the poll with your participants.</p>
        <div className='flex mt-5'>
            <TextField value={pollURL} onChange={handlePollUrlChange} /><Button onClick={copyToClipboard}><ContentPasteGoIcon />Copy</Button>
        </div>
        <Divider className='mt-5' /> 
        <div className='min-w-full'>
        <Button onClick={hideDialog} variant="greyVariant" color="secondary"
     className='mt-5 min-w-full'> Close</Button>
     </div>
    </div>
  )
}

export default ShareDialog