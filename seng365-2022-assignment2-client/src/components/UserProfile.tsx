import NavBar from "./NavBar";
import {
    Alert,
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Snackbar,
    TextField
} from "@mui/material";
import React, {useEffect} from "react";
import CSS from "csstype";
import {getDefaultImageSrc} from "../services/CommonServices";
import axios from "axios";
import {Delete, Edit} from "@mui/icons-material";

const UserProfile = () => {
    const [user, setUser] = React.useState<UserSelf>({firstName: "", lastName : "", email : ""});
    const [userUpdated, setUserUpdated] = React.useState(false);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [uploadPhotoModal, setUploadPhotoModal] = React.useState(false);
    const [changePasswordModal, setChangePasswordModal] = React.useState(false);

    const [firstNameError, setFirstNameError] = React.useState(false);
    const [firstNameHelperText, setFirstNameHelperText] = React.useState("");
    const [editFirstName, setEditFirstName] = React.useState(false);

    const [lastnameError, setLastNameError] = React.useState(false);
    const [lastnameHelperText, setLastNameHelperText] = React.useState("");
    const [editLastName, setEditLastName] = React.useState(false);

    const [emailError, setEmailError] = React.useState(false);
    const [emailHelperText, setEmailHelperText] = React.useState("");
    const [editEmail, setEditEmail] = React.useState(false);

    const [oldPassword, setOldPassword] = React.useState("");
    const [oldPasswordError, setOldPasswordError] = React.useState(false);
    const [oldPasswordHelperText, setOldPasswordHelperText] = React.useState("");

    const [newPassword, setNewPassword] = React.useState("");
    const [newPasswordError, setNewPasswordError] = React.useState(false);
    const [newPasswordHelperText, setNewPasswordHelperText] = React.useState("");

    const [matchPassword, setMatchPassword] = React.useState("");
    const [passwordMatchError, setPasswordMatchError] = React.useState(false);
    const [passwordMatchHelperText, setPasswordMatchHelperText] = React.useState("");

    const [userHasImage, setUserHasImage] = React.useState(false);
    const [uploadPhotoButton, setUploadPhotoButton] = React.useState(true);
    const [editUserPhoto, setEditUserPhoto] = React.useState([]);
    const [fileExtension, setFileExtension] = React.useState("jpg");

    const [showDeletePhotoDialog, setShowDeletePhotoDialog] = React.useState(false);
    const [snackError, setSnackError] = React.useState(true);
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [tempBrowsedImage, setTempBrowsedImage] = React.useState("");
    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };


    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        marginTop: "0px",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "space-around",
    }

    const dataTitle : CSS.Properties = {
        float: "left",
        margin: '10px',
        width: "100px",
        display: "grid",
        justifyContent: "start",
    }

    const userData : CSS.Properties = {
        float: "left",
        margin: "10px",
        display: "grid",
        justifyContent: "start",
    }

    useEffect(() => {
        getUserDetails();
    }, [userUpdated, uploadPhotoModal, changePasswordModal, user.firstName, user.lastName, user.email])

    const getUserDetails = () => {
        axios.get("http://localhost:4941/api/v1/users/" + localStorage.getItem("userId"), {
            headers: {
                "X-Authorization": localStorage.getItem("token")!
            }
        })
            .then ((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setUser(response.data)
                setUserUpdated(true)
                setEditFirstName(response.data.firstName)
                setEditLastName(response.data.lastName)
                setEditEmail(response.data.email)
                localStorage.setItem("lastName", response.data.lastName);
                localStorage.setItem("firstName", response.data.firstName);
                localStorage.setItem("email", response.data.email);
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString())
            });
        axios.get("http://localhost:4941/api/v1/users/"+ localStorage.getItem("userId") +"/image")
            .then((response) => {
                setUserHasImage(true);
            }, (error) => {
                setUserHasImage(false);
            })
    }

    const editUserDataRequest = () => {
        axios.patch("http://localhost:4941/api/v1/users/" + localStorage.getItem("userId"), {"firstName":editFirstName, "lastName":editLastName, "email":editEmail},
            {
                headers: {
                    "X-Authorization" : localStorage.getItem("token")!
                }
            })
            .then((response) => {
                getUserDetails();
                setErrorFlag(false)
                setErrorMessage("")
                getUserDetails();
                setUserUpdated(true);
                setSnackOpen(true)
                setSnackError(false)
                setSnackMessage("User Update Completed")
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
                setSnackOpen(true)
                setSnackError(true)
                setSnackMessage(error.response.statusText)
            })
    }

    const uploadUserPhotoRequest = () => {
        setUploadPhotoModal(false);
        setUserUpdated(false);
        if (editUserPhoto !== null) {
            setUserUpdated(false)
            axios.put("http://localhost:4941/api/v1/users/" + localStorage.getItem("userId") + "/image", editUserPhoto,
                {
                    headers: {
                        "X-Authorization" : localStorage.getItem("token")!,
                        "Content-Type" : fileExtension
                    }
                })
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setSnackOpen(true)
                    setSnackError(false)
                    setSnackMessage("Photo Upload Successfully")
                    setTimeout(function() { //Start the timer
                        window.location.reload();
                    }, 600)

                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                    setSnackOpen(true)
                    setSnackError(true)
                    setSnackMessage(error.response.statusText)
                })
        }
    }


    const deleteUserPhotoRequest = () => {
        axios.delete("http://localhost:4941/api/v1/users/" + localStorage.getItem("userId") + "/image", {
            headers: {
                "X-Authorization": localStorage.getItem("token")!
            }
        })
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setSnackOpen(true)
                setSnackError(false)
                setSnackMessage("Photo Deleted Successful")
                window.location.reload();
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
                setSnackOpen(true)
                setSnackError(true)
                setSnackMessage(error.response.statusText)
            })
    }

    const changePasswordRequest = () => {
        setUploadPhotoModal(false);
        setChangePasswordModal(false);
        axios.patch("http://localhost:4941/api/v1/users/" + localStorage.getItem("userId"), {currentPassword: oldPassword, password: newPassword}, {
            headers: {
                "X-Authorization": localStorage.getItem("token")!
            }
        })
            .then((response) => {
                setSnackMessage("Password Changed Successfully")
                setSnackOpen(true)
                setSnackError(false)
                setErrorFlag(false)
                setErrorMessage("")
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString());
                setSnackError(true)
                setSnackOpen(true)
                setSnackMessage(error.response.statusText)
            })
    }


    const editFirstNameHandler = (event : any) => {
        if (event.target.value.match("[a-zA-Z]+")) {
            setFirstNameError(false);
            setFirstNameHelperText("");
            setEditFirstName(event.target.value);
        } else {
            setFirstNameError(true);
            setFirstNameHelperText("First Name must be between 3 and 15 alphabetical characters");
        }
    }

    const editLastNameHandler = (event : any) => {
        if (event.target.value.match("[a-zA-Z]+")) {
            setLastNameError(false);
            setLastNameHelperText("");
            setEditLastName(event.target.value);
        } else {
            setLastNameError(true);
            setLastNameHelperText("Last Name must be between 3 and 15 alphabetical characters");
        }
    }

    const editEmailHandler = (event : any) => {
        if (event.target.value.match("^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+")) {
            setEmailError(false);
            setEmailHelperText("");
            setEditEmail(event.target.value);
        } else {
            setEmailError(true);
            setEmailHelperText("Please enter a valid email");
        }
    }

    const oldPasswordHandler = (event: any) => {
        if (event.target.value.length >= 6) {
            setOldPassword(event.target.value);
            setOldPasswordError(false);
            setOldPasswordHelperText("");
        } else {
            setOldPasswordError(true);
            setOldPasswordHelperText("Password must be at least 6 characters long");
        }
    }

    const newPasswordHandler = (event: any) => {
        if (event.target.value.length >= 6) {
            setNewPassword(event.target.value);
            setNewPasswordError(false);
            setNewPasswordHelperText("");
        } else {
            setNewPasswordError(true);
            setNewPasswordHelperText("Password must be at least 6 characters long");
        }
    }

    const matchingPasswordHandler = (event: any) => {
        if (event.target.value === newPassword) {
            setMatchPassword(event.target.value);
            setPasswordMatchError(false);
            setPasswordMatchHelperText("");
        } else {
            setPasswordMatchError(true);
            setPasswordMatchHelperText("Password does not match!!!");
        }
    }

    const editUserPhotoHandler = (event: any) => {
        if (event.target.files.length > 0 ) {
            setTempBrowsedImage(URL.createObjectURL(event.target.files[0]))
            setEditUserPhoto(event.target.files[0]);
            setFileExtension(event.target.files[0].type);
            setUploadPhotoButton(false)
        }
    }

    const deletePhotoDialogHandler = () => {
        setShowDeletePhotoDialog(!showDeletePhotoDialog);
    }

    const editUserData = () => {
        return (
            <div>
                <form key={"editUserDataForm"} style={{display:"grid", background : "rgba(135, 206, 235, 0.3", borderRadius:"30px"}}>
                    <h2>Edit User Details</h2>

                    <TextField label={"First Name"} type={"text"} variant={"outlined"} name={"firstName"} defaultValue={localStorage.getItem("firstName")}
                               error={firstNameError} onChange={editFirstNameHandler} helperText={firstNameHelperText} inputProps={{maxLength:64}}
                               style={{margin:"10px"}} required={true} className={"inputClasses"}/>
                    <TextField label={"Last Name"} type={"text"} variant={"outlined"} name={"lastName"} defaultValue={localStorage.getItem("lastName")}
                               error={lastnameError} onChange={editLastNameHandler} helperText={lastnameHelperText} inputProps={{maxLength:64}}
                               style={{margin:"10px"}} required={true}  className={"inputClasses"}/>
                    <TextField label={"Email"} type={"text"} variant={"outlined"} name={"email"} defaultValue={localStorage.getItem("email")}
                               error={emailError} onChange={editEmailHandler} helperText={emailHelperText} inputProps={{maxLength:128}}
                               style={{margin:"10px"}} required={true}  className={"inputClasses"}/>
                    <br/>
                    <div key={"registrationSubmitButtonDiv"} style={{height:"50px", width:"100%", paddingLeft:"5%"}}>
                        <Button variant={"contained"} color={"secondary"} type={"button"} style={{width:"120px"}}
                                onClick={editUserDataRequest} data-dismiss={"modal"} disabled={!(!firstNameError && !lastnameError && !emailError)}>
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        )
    }

    const editUserPhotoModal = () => {
        return (
            <div>
                <form key={"uploadUserPhotoForm"} style={{display:"grid", background : "rgba(135, 206, 235, 0.3", borderRadius:"30px"}}>
                    <h2>Change User Photo:</h2>
                    <img src={tempBrowsedImage}  hidden={editUserPhoto.length === 0} style={{width:"150px", height:"150px", marginLeft:"33%"}}/>

                    <input type={"file"} style={{margin:"0 0 0 25%"}} accept={"image/jpeg, image/gif, image/png"}
                            onChange={editUserPhotoHandler}/>
                    <br/>
                    <div key={"uploadNewUserPhoto"} style={{height:"50px", width:"100%", paddingLeft:"5%"}}>
                        <Button variant={"contained"} color={"secondary"} type={"button"} style={{width:"120px"}}
                            onClick={uploadUserPhotoRequest} data-dismiss={"modal"} disabled={uploadPhotoButton}>
                            Upload
                        </Button>
                    </div>

                </form>
            </div>
        )
    }

    const editUserPassword = () => {
        return (
            <div>
                <form key={"editPasswordForm"} style={{display:"grid", background : "rgba(135, 206, 235, 0.3", borderRadius:"30px"}}>
                    <h2>Change User Password</h2>

                    <TextField label={"Enter Old Password"} type={"password"} variant={"outlined"} name={"oldPassword"} placeholder={"Old Password"}
                               error={oldPasswordError} onChange={oldPasswordHandler} helperText={oldPasswordHelperText} inputProps={{maxLength:256}}
                               style={{margin:"10px"}} required={true} className={"inputClasses"}/>
                    <TextField label={"Enter New Password"} type={"password"} variant={"outlined"} name={"newPassword"} placeholder={"New Password"}
                               error={newPasswordError} onChange={newPasswordHandler} helperText={newPasswordHelperText} inputProps={{maxLength:256}}
                               style={{margin:"10px"}} required={true}  className={"inputClasses"}/>
                    <TextField label={"Enter New Password"} type={"password"} variant={"outlined"} name={"Re-enterPassword"} placeholder={"Re-enter Password"}
                               error={passwordMatchError} onChange={matchingPasswordHandler} helperText={passwordMatchHelperText} inputProps={{maxLength:256}}
                               style={{margin:"10px"}} required={true}  className={"inputClasses"}/>
                    <br/>
                    <div key={"registrationSubmitButtonDiv"} style={{height:"50px", width:"100%", paddingLeft:"5%"}}>
                        <Button variant={"contained"} color={"secondary"} type={"button"} style={{width:"120px"}}
                                onClick={changePasswordRequest} data-dismiss={"modal"} disabled={!(oldPassword.length > 6 &&
                                                newPassword.length > 6 && matchPassword.length > 0 && !passwordMatchError)}>
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div>
            {<NavBar/>}
            <Paper elevation={4} style={card}>
                <div style={{display:"grid", justifyContent:"center", borderStyle:"dotted", borderColor:"gray", padding:"40px"}}>
                    <h1 id={"userProfileHeading"}>
                        User Profile
                    </h1>
                    <div id={"userImage"}>
                        <img src={"http://localhost:4941/api/v1/users/"+ localStorage.getItem("userId") +"/image"} onError={getDefaultImageSrc} width="250px" height="250px" />
                        <br/>
                        <Button variant={"contained"} data-target={"#editUserDataModal"} data-toggle={"modal"} color={"info"} startIcon={<Edit/>}
                                style={{width:"100px", fontSize:"14px", margin:"3px 20px 3px 0"}} onClick={() => {setUploadPhotoModal(true)}}>
                            Photo</Button>
                        <Button variant={"contained"} color={"error"} startIcon={<Delete/>} disabled={!userHasImage}
                                style={{width:"100px", fontSize:"14px", margin:"3px 0 3px 20px"}} onClick={deletePhotoDialogHandler}>
                            Photo</Button>
                        <>
                            <Dialog open={showDeletePhotoDialog}
                                    onClose={deletePhotoDialogHandler}
                                    aria-labelledby={"alert-dialog-title"}
                                    aria-describedby={"alert-dialog-description"}>
                                <DialogTitle>
                                    Confirmation Required
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Are you Sure, You would like to delete profile photo?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button color={"error"} variant={"contained"} onClick={()=> deleteUserPhotoRequest()}>
                                        Delete
                                    </Button>
                                    <Button color={"info"} variant={"contained"}
                                            onClick={deletePhotoDialogHandler}>
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    </div>
                    <div id={"userDetails"} style={{minWidth:"500px", display:"contents"}}>
                        <div>
                            <p style={dataTitle}>First Name:</p>
                            <p style={userData}>{user.firstName}</p>
                        </div>
                        <div>
                            <p style={dataTitle}>Last Name:</p>
                            <p style={userData}>{user.lastName}</p>
                        </div>
                        <div>
                            <p style={dataTitle}>Email:</p>
                            <p style={userData}>{user.email}</p>
                        </div>
                            <Button variant={"contained"} data-target={"#editUserDataModal"} data-toggle={"modal"} color={"info"}
                                style={{margin:"0"}}>
                                Edit Details</Button>
                            <Button variant={"contained"} data-target={"#editUserDataModal"} data-toggle={"modal"} color={"info"}
                                    style={{marginTop:"10px"}} onClick={() => {setChangePasswordModal(true)}}>
                                Change Password</Button>
                    </div>

                </div>
            </Paper>

            <div key={"editUserData"}>
                <div>
                    <div className="modal fade" id="editUserDataModal" tabIndex={-1}
                         role="dialog"
                         aria-labelledby="editUserDataModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content" style={{width:"690px", marginLeft:"-20%", borderRadius:"30px", padding:"25px"}}>
                                <div className="modal-body" style={{display:"flex", justifyContent:"center"}}>
                                    <Paper elevation={4} style={{padding: "50px", margin: "20px", marginTop: "0px", minWidth:"fit-content",
                                        width:"100%", borderRadius:"30px"}}>
                                        {uploadPhotoModal ? editUserPhotoModal() : (!changePasswordModal ? editUserData() : editUserPassword())}
                                    </Paper>
                                </div>
                                <div className={"modal-footer"}>
                                    <Button type="button" className="btn btn-primary" style={{borderRadius:"10px", color:"black", textDecoration:"underline", width:"100px"}}
                                            data-dismiss="modal" onClick={() => {setUploadPhotoModal(false); setUploadPhotoButton(true); setTempBrowsedImage("")
                                                                                setChangePasswordModal(false);
                                                                                setTempBrowsedImage("")}}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Snackbar
                autoHideDuration={6000}
                open={snackOpen}
                onClose={handleSnackClose}
                key={snackMessage}
            >
                <Alert onClose={handleSnackClose} variant={"filled"} severity={snackError ? "error" : "success"} sx={{
                    width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default UserProfile;