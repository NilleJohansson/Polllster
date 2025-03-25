import React from 'react'
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function Login({ showSignupModal }) {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      };

      const showSignUpDialog = () => {
        console.log("Show sign up dialog");
        showSignupModal();
      };

  return (
    <div className='flex flex-col'>
        <TextField id="email" label="Email" variant="standard" type='email' sx={{ mb: 1, minWidth: 100 }} />
        <FormControl sx={{ mb: 2, width: '25ch' }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button variant="contained">Sign in</Button>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" />

        <div className='mt-1'>
          <p>New to Pollster?<b className='cursor-pointer hover:underline ml-1' onClick={showSignUpDialog}>Sign up now.</b></p>
        </div>
    </div>
  )
}

export default Login