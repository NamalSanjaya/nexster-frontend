import React, {useMemo} from "react";
import {Stack, Typography, Drawer, List, Avatar, Divider, Box, TextField,
    ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material'
import { GetUserInfoFromLS } from "../../apis/store";
// filled icons
// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
// import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
// import TextsmsRoundedIcon from '@mui/icons-material/TextsmsRounded';
// import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';

// for outline icons
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';

const drawerWidth = "11%";
const firstnameLimit = 12

function limitUserFirstname(firstname="") {
    return firstname.length > firstnameLimit ? firstname.substring(0, firstnameLimit) + ".." : firstname
}

export default function Base1({styles, SideComponent}){
    const {name, imgUrl} =  useMemo(GetUserInfoFromLS, [])

    return (
        <Stack direction="row" spacing={0} sx={{height: "auto"}}>
            <Drawer
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                border: "1px solid #000",
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                }}
                variant="persistent"
                anchor="left"
                open={true}>
            
            <Typography sx={{paddingLeft: "8%", marginBottom: "15%", marginTop: "10%"
            }} variant="h4"> 
                Nexster 
            </Typography>
            
                <List > 
                    <ListItem key={1} disablePadding >
                        <ListItemButton href="/" >
                            <ListItemIcon>
                                <HomeOutlinedIcon sx={{width: "30px", height: "30px"}}/>
                            </ListItemIcon>
                            <ListItemText primary={"Home"} disableTypography sx={{fontSize: 18}}/>
                        </ListItemButton>
                    </ListItem>

                    <ListItem key={2} disablePadding>
                        <ListItemButton href="/friends">
                            <ListItemIcon>
                                <PeopleAltOutlinedIcon sx={{width: "30px", height: "30px"}}/>
                            </ListItemIcon>
                            <ListItemText primary={"Friends"} disableTypography sx={{fontSize: 18}}/>
                        </ListItemButton>
                    </ListItem>

                    <ListItem key={3} disablePadding>
                        <ListItemButton href="/events">
                            <ListItemIcon>
                                <EventAvailableOutlinedIcon sx={{width: "30px", height: "30px"}}/>
                            </ListItemIcon>
                            <ListItemText primary={"Events"} disableTypography sx={{fontSize: 18}}/>
                        </ListItemButton>
                    </ListItem>

                    <ListItem key={4} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <AddCircleOutlineRoundedIcon  sx={{width: "30px", height: "30px"}}/>
                            </ListItemIcon>
                            <ListItemText primary={"Share"}  disableTypography sx={{fontSize: 18}}/>
                        </ListItemButton>
                    </ListItem>

                </List>
                <Divider />

                <ListItem key={5} disablePadding sx={{marginTop: "15%"}}> 
                    <ListItemButton>
                        <ListItemIcon>
                            <Avatar alt={name} src={imgUrl}  />
                        </ListItemIcon>
                        <ListItemText primary={limitUserFirstname(name)}  disableTypography sx={{fontSize: 18}}/>
                    </ListItemButton>
                </ListItem>

                <Typography variant="caption" sx={{position: "fixed", bottom: 10, marginLeft: "0.8%"}}> © 2023 Namal Sanjaya </Typography>
            </Drawer>

            <Box
                component="main"
                sx={[{display: "flex", flexDirection: "column",flexGrow: 1, bgcolor: 'background.default', minHeight: "100vh"}, styles]}>
                <TextField id="outlined-search" type="search" size="small" label="Find Friends..." variant="filled"
                sx={{position: "fixed", right: "8px", marginTop: "5px"}}/>
                {SideComponent}
            </Box>
        </Stack>
    )
}
