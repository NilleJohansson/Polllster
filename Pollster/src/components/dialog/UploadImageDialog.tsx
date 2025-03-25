import styles from './UploadImageDialog.module.css';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function UploadeImageDialog(props) {
  const { onImageSelected } = props;
  const onDropAccepted = useCallback(acceptedFiles => {
    onImageSelected(acceptedFiles);
  }, [])

  const onDropRejected = useCallback((error) => {
    console.log(error);
  }, []);

  const {getRootProps} = useDropzone({onDropAccepted, onDropRejected, accept: {'image/jpeg': [], 'image/png': [], 'image/gif': []}, 
          maxSize: 6000})

  return (
    <div {...getRootProps()}>  
    <div className={styles.uploadImageContainer}>
      <div><CreateNewFolderOutlinedIcon fontSize='inherit' className='text-grey-sub-color text-5xl' /></div>
      <div className='text-center mt-4'>
      <p><span style={{fontWeight: 'bold'}}>Click to upload or drop an image right here</span><br />
        <span>JPG, PNG, or GIF. Up to 6MB.</span></p>
          <span className='inline-block mt-3 text-red-600 text-center'>Offensive or explicit images are not permitted and will reuslt in a ban.</span></div>
       </div>
    </div>
  )
}

export default UploadeImageDialog