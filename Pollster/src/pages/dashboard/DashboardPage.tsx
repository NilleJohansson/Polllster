import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react'
import styles from './DashboardPage.module.css';
import Button from '@mui/material/Button';
import PollListItem from './PollListItem';
import ApiClient from '../../api/ApiClient';
import useAuth from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import VoteAddedDialog from '../poll/VoteAddedDialog';

function DashboardPage() {
  const navigate = useNavigate();

//   interface DashboardMenuType {
//     name: string;
//     icon: string;
//     path: string;
//   }
//   const menuItems: DashboardMenuType[] = [
//     { name: 'Dashboard', icon: 'Icon', 'path': 'Dashboard'}
//   ]

//   const dashBoardMenuItems = menuItems.map(item => {
//     return 
//     <ListItem>

//     </ListItem>
//   })

const userAPI = ApiClient('http://localhost:8080/api/user/');
const { user } = useAuth();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [profileData, setProfileData] = useState({} as any);


useEffect(() => {
  const fetchProfileData = async() => {
    const profileDataWrapper = await userAPI.get("profile", {
      headers: { Authorization: `Bearer ${user?.accessToken}` }
    });
    setProfileData(profileDataWrapper.data);
  };

  fetchProfileData();
}, []);

const userPolls = profileData?.polls?.map(poll => {
  console.log(poll);
  
  return <PollListItem onClick={() => goToPoll(poll.id)} poll={poll} key={poll.id} />
})

  function goToCreatePoll(): void {
    navigate("/createNewPoll")
  }

  function goToPoll(pollID: string) {
    console.log("GO TO POLL");
    navigate("/poll/" + pollID);

  }

  return (
  <>
    <div className={styles.container}>
        <div className={styles.dashboardContainer}>
        <h1>Dashboard</h1>
        <Button onClick={goToCreatePoll} variant="contained"
        color="primary" className='mt-5'><AddIcon /> Create poll</Button>
        <section>
          <header className={styles.pollListItemsHeader}>
            <p>Polls</p>
            <p className='flex justify-center'>Votes</p>
            <p className='flex justify-center'>Deadline</p>
            <p className='flex justify-center'>Status</p>
          </header>
        <div className='flex flex-col gap-3'>
        { userPolls?.length > 0 ? userPolls : <p className='mt-3'>You have not created any polls yet.
          </p> }
        </div>
        </section>
         {/* <List className=''>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Inbox" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Drafts" />
            </ListItemButton>
          </ListItem>
        </List> */}
        </div>
    </div>
    </>
  )
}

export default DashboardPage
