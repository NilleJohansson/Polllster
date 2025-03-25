import CheckCircle from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const MULTIPLE_CHOICE = "Multiple choice";
const MEETING_POLL = "Meeting poll";
const IMAGE_POLL = "Image poll";
const RANKING_POLL = "Ranking poll";

type VotingType = {
    name: string,
    icon: React.ReactNode
}

const votingTypes: Array<VotingType> = [
    {name: MULTIPLE_CHOICE, icon: <CheckCircle />},
    {name: MEETING_POLL, icon: <CalendarMonthIcon />},
    {name: IMAGE_POLL, icon: <ImageOutlinedIcon />},
    {name: RANKING_POLL, icon: <LeaderboardIcon />}
]

export { votingTypes, MULTIPLE_CHOICE, MEETING_POLL, IMAGE_POLL, RANKING_POLL }