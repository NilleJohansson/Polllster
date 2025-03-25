import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Dialog from "../dialog/Dialog.tsx";
import Login from "../login/Login.tsx";
import Signup from "../signup/Signup.tsx";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import Divider, { dividerClasses } from "@mui/material/Divider";
import useAuth from "../../context/useAuth.tsx";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';


function Navbar() {
  const navigate = useNavigate();
  const { user, logout, refreshToken } = useAuth();

  console.log("User", user);
  
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setAnchorEl(null);
    }
  }, [user])
  
  // Removed as logout didn't work with
  // useEffect(() => {
  //   console.log("Check if user exists");
  //   if (!user) {
  //     console.log("REFRESH TOKEN");
  //     refreshToken();
  //   }
  // }, [refreshToken, user]);


  const hideLoginModal = () => {
    setShowLoginDialog(false);
  };

  const showSignupModal = () => {
    setShowLoginDialog(false);
    setShowSignupDialog(true);
  };

  const hideSignupModal = () => {
    setShowLoginDialog(false);
  };

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuOpenClick = (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>): void => {
    console.log("Menu click open");
    
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    console.log("MENU CLOSE");
    
    setAnchorEl(null);
  };

  function goToCreateNewPollPage(): void {
    navigate("/createNewPoll");
  }

  function goToLoginPage(): void {
    navigate("/login")
  }

  function goToSignupPage(): void {
    navigate("/signup")
  }

  function goToDashboard(): void {
    navigate("/account")
    setAnchorEl(null);
  }

  function signOut() : void {
    logout();
  }

  return (
    <>
      <div>
      <div className="w-100 flex flex-col items-center max-h-[75px] pt-2 pb-2">
      <div className="flex justify-between min-h-[100%] items-center min-w-[40%] max-w-xl">
        <div className="flex items-center gap-5">
        <h1 className="text-4xl text-white">Pollster</h1>
        <Button
            onClick={goToCreateNewPollPage}
            variant="transparentVariant"
            className={styles.navButton}
            >Create poll</Button>
            </div>
        <div className="flex mr-5 mt-1 mb-1 text gap-2">
          { user && Object.keys(user).length > 0 ? 
          <div>
          <div onClick={handleMenuOpenClick} id="basic-button" aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined} className="text-white flex justify-center items-center cursor-pointer">
          <span  className={styles.circle}>{user?.username?.charAt(0).toUpperCase()}
        </span><span className="ml-3">{user.username}</span>
          </div>
          <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={goToDashboard} className="flex justify-center items-center"><HomeIcon />Dashboard</MenuItem>
        <MenuItem onClick={signOut}><LogoutIcon />Sign out</MenuItem>
      </Menu>
          </div>
          :
            <div>
        <Button
            onClick={goToLoginPage}
            variant="transparentVariant"
            disableRipple
            >Login</Button>
          <Button
            onClick={goToSignupPage}
            variant="contained"
            color="primary"
            className={styles.navButton}
          >
            Sign up
          </Button>
          </div> 
          }
        </div>
      </div>
      </div>
      <Divider className="max-h-[1px]" />
      </div>
    </>
  );
}

export default Navbar;
