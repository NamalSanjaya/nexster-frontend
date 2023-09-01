import { Box } from "@mui/material";

import Base1 from "../layout/base1";
import FriendReqsPanel from "./friend_req_panel";
import FriendSuggPanel from "./friends_sugg_panel";

const initReqCount = 3
const regReqCount = 1
const friendPanelSuggs = 9

function SideFriendsPanel(){

    return (
        <Box sx={{marginTop: "1%", marginLeft: "6%"}}>
           <FriendReqsPanel rootStyles={{marginBottom: "30px"}} showButton={true} initPageNo={1} 
           initPageSize={initReqCount} pageSize={regReqCount}/>
           <FriendSuggPanel rootStyles={{marginTop: "30px", marginBottom: "30px"}} showButton={true} pageSize={friendPanelSuggs}/>
        </Box>
    )
}

export default function FriendsPanel(){

    return (
        <Base1 SideComponent={<SideFriendsPanel />} styles={{alignItems: "flex-start"}}/>
    )
}
