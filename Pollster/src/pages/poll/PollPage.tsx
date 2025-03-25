import Button from '@mui/material/Button';
import Card from '@mui/material/Card'
import FormControlLabel from '@mui/material/FormControlLabel';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ShareIcon from '@mui/icons-material/Share';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Checkbox, Paper, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import ApiClient from '../../api/ApiClient';
import moment from 'moment';
import Alert from '@mui/material/Alert';
import VoteAddedDialog from './VoteAddedDialog.tsx';
import HorizontalBarChart from './HorizontalBarChart.tsx';
import Divider from '@mui/material/Divider';
import SensorsIcon from '@mui/icons-material/Sensors';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Dialog from '../../components/dialog/Dialog.tsx';
import ShareDialog from './ShareDialog.tsx';
import PollComments from './PollComments.tsx';
import { FormInputText } from '../../components/formInputs/FormInputTextField.tsx';
import useAuth from '../../context/useAuth.tsx';
import { getTimeFromEvent } from '../../utils/DateAndTimeUtils.ts';
import { truncateByDomain } from 'recharts/types/util/ChartUtils';
import { useAlert } from '../../context/useAlert.tsx';

function PollPage() {
  const pollAPI = ApiClient('http://localhost:8080/api/poll/');
  const pollEventSourceURL: string = 'http://localhost:8080/api/poll/getPollVotes/{pollID}';
  const { user } = useAuth();
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pollData, setPollData] = useState({} as any);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [votingError, setVotingError] = useState<boolean>(false);
  const [votingErrorMessage, setVotingErrorMessage] = useState<string>('');
  const [showVoteAddedModal, setShowVoteAddedModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showResult, setShowResult]  = useState<boolean>(false);
  const [participantName, setParticipantName] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [otherOptionSelected, setOtherOptionSelected] = useState<boolean>(false);
  const [otherOptionValue, setOtherOptionValue] = useState<string>('');
  const otherOptionRef = useRef<HTMLInputElement>(null);
  const { showAlert } = useAlert();
  

  const otherOption = {
    isOther: true,
    id: 'otheroption'
  };

  useEffect(() => {
    const fetchPoll = async() => {
      const pollDataResult = await pollAPI.get(id ? id : "");

      console.log("Poll data result", pollDataResult.data);
      
      setParticipantName(user?.username || '');

      setPollData(pollDataResult.data);

      console.log("Poll complete data", pollDataResult.data);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log("Hide share button", pollDataResult.data.settings?.hideShareButton);
    };
  
    if (id) {
      fetchPoll();
    }

    const eventSource = new EventSource(pollEventSourceURL.replace('{pollID}', id || 'defaultId'));
    eventSource.onmessage = (e) => updatePollStatus(e.data);
  

    return () => {
      eventSource.close();
    }
  }, []);

  useEffect(() => {
    console.log("Hide button", pollData.settings?.hideShareButton);
      }, [pollData]);

    console.log("Voting options", pollData?.votingOptions);


    const handleOtherOptionSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;

      setSelectedOptions((prev) =>
        checked ? [...prev, otherOption] : prev.filter((option) => option.id !== otherOption.id)
      );

      if (checked) {
         otherOptionRef.current?.focus();
      }
    }

    const handlePollSelection = (event: React.ChangeEvent<HTMLInputElement>, isOtherOption: boolean) => {
      const { value, checked } = event.target;

      const selectedOption = pollData.votingOptions.find(op => op.id === value && op.otherOption === false);

      console.log("Selected option", selectedOption);

      setSelectedOptions((prev) =>
        checked ? [...prev, selectedOption] : prev.filter((option) => option.id !== selectedOption.id)
      );

      if (isOtherOption && checked) {
         otherOptionRef.current?.focus();
      }
    };

    const getCheckboxDisabled = (optionID: string): boolean => {
      const toAmountOfSelections: number = pollData.settings?.toAmountOfSelections;

      if (toAmountOfSelections < 0) return false;

      return selectedOptions.length >= toAmountOfSelections && !selectedOptions.some(option => option?.id == optionID);
    }
        
    const optionCheckBoxGroup = pollData?.votingOptions?.map(op => {  
      if (op.otherOption) return false;
      return <div className='flex' key={op.id}>
        <FormControlLabel
       value={op.id} 
       control={
        <Checkbox
        value={op.id}
        checked={selectedOptions.some(option => option?.id === op?.id)}
        onChange={(e) => handlePollSelection(e, op.otherOption)}
        disabled={getCheckboxDisabled(op.id)} 
        />
       } 
       key={op.id}
       label={op.option} />
       </div>
  })

  const hideVoteAddedModal = () => {
    setShowVoteAddedModal(false);
  }

  const hideShareModal = () => {
    setShowShareModal(false);
  }

  async function vote() {
    // if (pollData.userVoted) {
    //   showAlert("You have already voted on this poll.", "error", 4000);
    //   return;
    // }

    console.log("Selected options", selectedOptions);
    
    if (!selectedOptions || selectedOptions.length == 0) {
      setVotingErrorMessage('Please select an option');
      setVotingError(true);
      return;
    }

    const minAmountOfVotes: number = pollData.settings.fromAmountOfSelections;
    // const maxAmountOfVotes: number = pollData.settings.toAmountOfSelections;

    if (selectedOptions.length < minAmountOfVotes) {
      setVotingErrorMessage(`Please choose at least ${minAmountOfVotes} option(s)`);
      setVotingError(true);
      return;
    }

    if (pollData.settings.requireParticipantsName && participantName.trim().length <= 0) {
      setVotingErrorMessage('Please fill in the required field: Name');
      setVotingError(true);
      return;
    }

    const selectedOptionsRequest = selectedOptions.map(op => {
      let optionValue: string = op.option;
        if (op.isOther) {        
        if (otherOptionValue.length == 0) {
          console.log("In here 2");
          
          setVotingErrorMessage('The other option cannot be empty');
          setVotingError(true);
          return;
        }

        optionValue = otherOptionValue;
      }

        return {
          pollID: pollData.id,
          voteOptionID: op.id, 
          participantName: "testuser",
          isOther: op.isOther ?? false,
          otherOption: optionValue
        }
    });

    console.log("Selected options request", selectedOptionsRequest);
    

    try {
      await pollAPI.post("vote", selectedOptionsRequest)
      setVotingError(false);
    } catch (err) {
      const errorMessage = err?.response?.data || err?.message || 'An unknown error occurred';
      showAlert(errorMessage, "error", 4000);
      console.log("Error message", err); 
      return;
    }
    clearPollVote();
    setShowVoteAddedModal(true);
  }

  function clearPollVote() {
    setSelectedOptions([]);
    setOtherOptionValue('');
  }

  function handleOptionChange(event): void {
    setSelectedOption(event.target.value);
  }

  function showResultView() {
    hideVoteAddedModal();
    setShowResult(true);
    setSelectedOption('');
    setVotingError(false);
  }

  async function getResults() {
    try {
    const pollDataResult = await pollAPI.get(id ? id : "");
    setPollData(pollDataResult.data);
    } catch (err) {
      console.log(err);
    }

    setShowResult(true);
    setShowVoteAddedModal(false);
  }

  function showPollView() {
    hideVoteAddedModal();
    setShowResult(false);
    setSelectedOption('');
    setVotingError(false);
  }

  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updatePollStatus(data: any): void {
  console.log(data);
  console.log(pollData);
  const pollEventData = JSON.parse(data);

  pollData?.votingOptions?.forEach(option => {
    pollEventData?.votingOptions?.forEach(eventOption => {
      if (option.id == eventOption.id && option.voteAmount != eventOption.voteAmount) {
        option.voteAmount = eventOption.voteAmount;
      }
    })
  })
  setPollData(pollEventData);
}

  return (
    <>
    <Dialog
    showDialog={showVoteAddedModal}
    hideDialog={hideVoteAddedModal}
    content={<VoteAddedDialog showResult={getResults} hideShareButton={pollData?.settings?.hideShareButton}/>}
  /> 
  <Dialog
    showDialog={showShareModal}
    hideDialog={hideShareModal}
    title={<div><ShareIcon /><span>Share</span></div>}
    content={<ShareDialog hideDialog={hideShareModal} url={"localhost:5173/poll/" + pollData.id}/>}
  /> 

  <div className=''>
    <div className="flex flex-col mt-10 items-center">      
<Card
    sx={{
      minWidth: 600,
      maxWidth: 1500,
      paddingLeft: "20px",
      paddingRight: "20px",
      paddingBottom: "20px"
    }}
    variant="borderTop"
    className="mt-10"
  >
  <h3 className='mt-3'>{pollData.title}</h3>
  <p>by {pollData.createdBy} · {getTimeFromEvent(pollData.createTime)}</p>
  { showResult ? 
  <div>
  <HorizontalBarChart votingOptions={pollData.votingOptions}/>
  <Divider />
  <p className='mt-2'>Total votes: {pollData.votingOptions?.reduce((total, item) => total + item['voteAmount'], 0)}</p>
  <div className='flex justify-between items-center mt-3'>
    <div className='flex gap-2'>
  <Button
              variant="contained"
              color="primary"
              className="cursor-default"
            >
              <SensorsIcon />Live results
            </Button>
            <Button onClick={showPollView} variant="greyVariant" color="secondary">
            <KeyboardBackspaceIcon />Back to polls
              </Button>
              </div>
              <div>{pollData.settings.hideShareButton}</div>
              {!pollData.settings?.hideShareButton && <div>
              <Button onClick={() => setShowShareModal(true)} variant="greyVariant" color="secondary">
            <ShareIcon />Share
              </Button>
              </div>
              }
  </div>
  </div>
  : 
  <div>
  <p className='mt-8'>Make a choice:</p>
  <div className='flex flex-col'>
    { optionCheckBoxGroup }
    { pollData?.hasOtherOption && 
    <div className='flex'>
        <FormControlLabel
       value={otherOption.id} 
       control={
        <Checkbox
        value={otherOption.id}
        checked={selectedOptions.some(option => option?.id === otherOption.id)}
        onChange={(e) => handleOtherOptionSelection(e)}
        disabled={getCheckboxDisabled(otherOption.id)} 
        />
       } 
       key={otherOption.id}
       label={"Other:"} />
      <TextField id="otherOption" className='w-full' inputRef={otherOptionRef} 
       value={otherOptionValue} onChange={(e) => setOtherOptionValue(e.target.value)} />
       </div>
    }
       </div>
  { pollData.settings?.requireParticipantsName &&
   <div className='flex flex-col'>
    <label className='text-gray-400'><span className='text-white'>Name</span> (required)</label>
    <TextField className='mb-2' value={participantName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      setParticipantName(event.target.value);
    }} />
   </div> 
   }
  { votingError ? <Alert className='mt-3' severity="error">{ votingErrorMessage }</Alert> : "" }
  <div className='flex justify-between'>
    <div className='flex gap-3'>
    <Button onClick={vote} variant="contained"
    color="primary" className='mt-5'>Vote <ArrowRightAltIcon /></Button>
    <Button onClick={getResults} variant="greyVariant" color="secondary"
     className='mt-5'> <SignalCellularAltIcon /> Show results</Button>
     </div>
     {!pollData.settings?.hideShareButton &&
     <div><Button onClick={() => setShowShareModal(true)} variant="greyVariant" color="secondary"
     className='mt-5'><ShareIcon/>Share</Button>
              </div>
      }
     </div>
     </div>
     }
  </Card>

  </div> 
   <PollComments poll={pollData} />
</div>

  </>
  )
}

export default PollPage

