const ALLOW_MULTIPLE_VOTES_PER_PERSON = "Allow multiple votes per person";
const ONE_VOTE_PER_BROWSER_SESSION = "One vote per browser session";
const ONE_VOTE_PER_IP_ADDRESS = "One vote per IP address";
const ONE_VOTE_PER_POLLSTER_ACCOUNT = "One vote per Pollster account";
const ONE_VOTE_PER_UNIQUE_CODE = "One vote per unique code";

const votingSecurityTypeList: Array<string> = [
    ALLOW_MULTIPLE_VOTES_PER_PERSON,
    ONE_VOTE_PER_BROWSER_SESSION,
    ONE_VOTE_PER_IP_ADDRESS,
    ONE_VOTE_PER_POLLSTER_ACCOUNT,
    ONE_VOTE_PER_UNIQUE_CODE
]

export { ALLOW_MULTIPLE_VOTES_PER_PERSON, ONE_VOTE_PER_BROWSER_SESSION, ONE_VOTE_PER_IP_ADDRESS,
    ONE_VOTE_PER_POLLSTER_ACCOUNT, ONE_VOTE_PER_UNIQUE_CODE, votingSecurityTypeList }