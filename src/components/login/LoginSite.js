import { useState } from "react"
import { Stack, Button, Typography, TextField, Link, Paper, useTheme } from "@mui/material"
import { useNavigate } from 'react-router-dom';

import { GetAccessToken, GetProfileInfo, accCreateLinkPath, PasswordResetLinkPath } from "../../apis/fetch"
import { SetAccessTokenInLS, SetUserDataInLS, CleanLS } from "../../apis/store"
import { BottomLeftSnackbar } from "../ui/snack_bar"
import { NoticeFooter } from "../layout/Footer";

// msgs
const failedLogin = "Failed to login. Try again"
const invalidCred = "Invalid credentials"

export default function LoginSite(){
    const navigate = useNavigate();
    const theme = useTheme();

    const [snackBarOpen, setSnackBarOpen] = useState(false)

    const [index, setIndex] = useState("")
    const [indexErr, setIndexErr] = useState("")

    const [password, setPassword] = useState("")
    const [passwordErr, setPasswordErr] = useState("")

    const [loginErr, setLoginErr] = useState("")

    const modeColor = theme.palette.mode === 'dark' ? 'white' : 'black' ;

    const onLogin = async () => {
        if(index === ""){
            setIndexErr("Please enter your index number")
            return
        }
        if(password === ""){
            setPasswordErr("Please enter your nexster password")
            return
        }

        // get access token from BE
        try {
            const info = await GetAccessToken(index, password)
            if(info.access_token === ""){
                setLoginErr(failedLogin)
                setSnackBarOpen(true)
                return
            }
            setLoginErr("")
            setIndex("")
            setPassword("")

            
            // Set access token in local storage
            SetAccessTokenInLS(info.access_token)
            const userInfo = await GetProfileInfo(info.id)
            if(userInfo === null){
                CleanLS()
                return
            }
            const fac = (userInfo.faculty || "").toLowerCase()
            SetUserDataInLS({
                gender: userInfo.gender,
                birthday: userInfo.birthday,
                faculty: fac,
                userid: userInfo.key,
                name: userInfo.firstName,
                indexNo: index,
                imgUrl: userInfo.img_url
            })

            navigate("/", { replace: true });

        } catch (err) {
            setLoginErr(invalidCred)
            setSnackBarOpen(true)
        }

    }

    const onChangeIndex = (e) => {
        if (indexErr !== "") {
            setIndexErr("")
        }
        const val = (e?.target?.value || "").toLowerCase()
        setIndex(val)
    }

    const onChangePassword = (e) => {
        if (password !== "") {
            setPasswordErr("")
        }
        setPassword(e.target.value)
    }

    return (
        <Stack justifyContent={"center"} alignItems={"center"} sx={{ height: "100%", bgcolor: 'background.default' }} spacing={3}>
            <Stack direction="row" color={modeColor} >
                <Typography variant="h6"  > Log into Nexster </Typography>
                <Typography variant="caption"> [beta] </Typography>
            </Stack>
            <Stack sx={{ width: "30%", color: modeColor }} spacing={4}>
                <Paper sx={{ padding: "20px", display: "flex", alignItems: "center", flexDirection: "column" }} elevation={4}>
                    <Stack spacing={2} alignItems={"center"} sx={{ width: "300px" , paddingTop: "25px", marginBottom: "60px"}}>
                        <TextField 
                            label="University index"
                            fullWidth
                            value={index}
                            onChange={onChangeIndex}
                            required
                            error={indexErr !== ""}
                            helperText={indexErr}
                        />

                        <TextField 
                            type="password"
                            label="Nexster password"
                            fullWidth
                            value={password}
                            onChange={onChangePassword}
                            required
                            error={passwordErr !== ""}
                            helperText={passwordErr}
                        />

                        <Stack sx={{ width: "100%"}}>
                            <Link href={PasswordResetLinkPath} underline="hover" sx={{marginY: "6px"}}> Forgot password ? </Link>
                        </Stack>

                        <Button variant="contained" onClick={onLogin}
                            sx={{ textTransform: "none", width: "100px", bgcolor: "#35dbcb"}}> Login </Button> 
                    </Stack>

                    <Stack direction={"row"} spacing={2}>
                        <Typography> Don't have an account? </Typography>
                        <Link href={accCreateLinkPath} underline="hover" sx={{marginTop: "2px"}}> Sign up </Link>
                    </Stack>
                </Paper>
                <NoticeFooter />
            </Stack>
            <BottomLeftSnackbar open={snackBarOpen}  setOpen={setSnackBarOpen} level={"error"} msg={loginErr}/>
        </Stack>
    )
}
