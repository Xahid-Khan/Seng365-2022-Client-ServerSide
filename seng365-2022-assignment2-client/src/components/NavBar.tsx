import {Link, useNavigate} from "react-router-dom";
import navBarImage from "../images/nav_logo.png"
import {Alert, Button, inputClasses, Paper, TextField} from "@mui/material";
import React from "react";
import axios from "axios";
import {getDefaultImageSrc} from "../services/CommonServices";
import {Login, Logout} from "@mui/icons-material";



const NavBar = () => {
    const navigate = useNavigate();
    const [fileType, setFileType] = React.useState("jpg");
    const [showRegistrationForm, setShowRegistrationForm] = React.useState(false);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [userEmail, setUserEmail] = React.useState("");
    const [userPassword, setUserPassword] = React.useState("");
    const [userId, setUserId] = React.useState(Number(localStorage.getItem("userId")));
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [formFirstNameError, setFormFirstNameError] = React.useState(false);
    const [formFirstNameMessage, setFormFirstNameMessage] = React.useState("");
    const [formLastNameError, setFormLastNameError] = React.useState(false);
    const [formLastNameMessage, setFormLastNameMessage] = React.useState("");
    const [formEmailError, setFormEmailError] = React.useState(false);
    const [formEmailMessage, setFormEmailMessage] = React.useState("");
    const [formPasswordError, setFormPasswordError] = React.useState(false);
    const [formPasswordMessage, setFormPasswordMessage] = React.useState("");
    const [formSubmitButton, setFormSubmitButton] = React.useState(false);
    const [userProfilePhoto, setUserProfilePhoto] = React.useState("");
    const [tempBrowsedImage, setTempBrowsedImage] = React.useState("")

    const [snackError, setSnackError] = React.useState(true)
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")

    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };


    React.useEffect(() => {
        if (localStorage.getItem("userId") !== null) getUser();
    }, [firstName, lastName, userEmail, errorFlag, errorMessage, userId, userProfilePhoto]
    )

    const getUser = () => {
        if (localStorage.getItem("userId")) {
            axios.get("http://localhost:4941/api/v1/users/" + localStorage.getItem("userId"), {
                headers: {
                    "X-Authorization": localStorage.getItem("token")!
                }
            })
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    localStorage.setItem("lastName", response.data.lastName);
                    localStorage.setItem("firstName", response.data.firstName);
                    localStorage.setItem("email", response.data.email);
                    // setUser(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                })
        }
    }

    const firstNameHandler = (event: any) => {
        if (event.target.value.match("[a-zA-Z]+")) {
            setFirstName(event.target.value);
            setFormFirstNameError(false);
        } else if (event.target.value.length < 3)  {
            setFormFirstNameError(true);
            setFormFirstNameMessage("First Name must be between 3 and 15 alphabetical characters");
        }
    }

    const lastNameHandler = (event: any) => {
        if (event.target.value.match("[a-zA-Z]+")) {
            setLastName(event.target.value);
            setFormLastNameError(false);
        } else if (event.target.value.length < 3)  {
            setFormLastNameError(true);
            setFormLastNameMessage("Last Name must be between 3 and 15 alphabetical characters");
        }
    }

    const emailHandler = (event: any) => {
        if (event.target.value.match("^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+")) {
            setUserEmail(event.target.value);
            setFormEmailError(false);
        } else if (event.target.value.length > 0) {
            setFormEmailError(true);
            setFormEmailMessage("Please enter a valid email");
        }
    }

    const passwordHandler = (event: any) => {
        if (event.target.value.length >= 6) {
            setUserPassword(event.target.value);
            setFormPasswordError(false);
            setFormSubmitButton(true);
        } else if (event.target.value.length > 0)  {
            setFormPasswordError(true);
            setFormPasswordMessage("Password must be at least 6 characters long");
        }
    }

    const userPhotoHandler = (event: any) => {
        if ("image/jpeg, image/png, image/gif".includes(event.target.files[0].type)) {
            setFileType(event.target.files[0].type);
            setUserProfilePhoto(event.target.files[0]);
            setTempBrowsedImage(URL.createObjectURL(event.target.files[0]));
            setErrorMessage("");
        } else {
            event.target.value = null;
            setUserProfilePhoto("");
            setTempBrowsedImage("");
            setErrorMessage("Invalid Image Type (Allowed: JPEG, GIF, PNG)")
        }
    }

    const registerUserHandler = () => {
        axios.post("http://localhost:4941/api/v1/users/register", {"firstName": firstName, "lastName": lastName, "email": userEmail, "password": userPassword})
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                loginAttemptHandler()
                }, (error) => {
                setErrorFlag(true);
                setFormEmailMessage(error.response.statusText)
                setFormEmailError(true)
                setErrorMessage(error.response.statusText);
                }
            )
    }

    const loginAttemptHandler = () => {
        axios.post("http://localhost:4941/api/v1/users/login", {"email":userEmail, "password":userPassword})
            .then((response) => {
                localStorage.setItem("userId", response.data.userId)
                localStorage.setItem("token", response.data.token)
                if (userProfilePhoto !== "") {
                    axios.put("http://localhost:4941/api/v1/users/"+ response.data.userId +"/image", userProfilePhoto, {
                        headers: {
                            "X-Authorization" : localStorage.getItem("token")!,
                            "Content-Type" : fileType
                        }
                    })
                        .then((response) => {
                            setErrorFlag(false)
                            setErrorMessage("")
                            window.location.reload();
                        }, (error) => {
                            setErrorFlag(true)
                            setErrorMessage(error.response.statusText)
                        })
                } else {
                    window.location.reload();
                }
                setErrorFlag(false);
                setErrorMessage("");
                getUser();
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.response.statusText);
                }
            )
    }

    const logoutUserHandler = () => {
        axios.post("http://localhost:4941/api/v1/users/logout", {} , {
            headers: {
                "X-Authorization": localStorage.getItem("token")!
            }
        })
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                localStorage.clear();
                setUserId(-1);
                navigate("/auctions");
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })


    }


    const getLoginForm = () => {
        return (
            <div>
                <form key={"loginPopUpModalForm"} style={{display:"grid", background : "rgba(135, 206, 235, 0.3", borderRadius:"30px"}}>
                    <img src={navBarImage} width={"200px"} height={"200px"} style={{justifySelf:"center"}}/>
                    <h2>Login</h2>
                    <TextField id={"loginEmailField"} label={"Email"} helperText={formEmailMessage}
                               error={formEmailError} placeholder={"Email"} type={"text"} inputProps={{maxLength:128}}
                               style={{margin:"10px"}} name="loginEmail" required={true} onChange={emailHandler}/>
                    <TextField id={"loginPasswordField"} label={"Password"} helperText={formPasswordMessage}
                               error={formPasswordError} variant={"outlined"} required={true} type={"password"} inputProps={{maxLength:256}}
                               style={{margin:"10px"}} name="loginPassword" placeholder={"********"} onChange={passwordHandler}/>
                    {
                        errorFlag ?
                        <Alert severity={"error"}>{errorMessage}</Alert> : ""
                    }
                    <br/>
                    <div key={"loginButtonDiv"} style={{height:"40px"}}>
                        <Button key={"loginSubmitButton"} style={{float:"right", marginRight:"20%", width:"130px", fontWeight:"bold"}}
                                variant="outlined" color="success" autoFocus type={"button"} onClick={loginAttemptHandler}
                                disabled={!(!formEmailError && !formPasswordError && formSubmitButton)}>
                            LogIn
                        </Button>
                    </div>
                </form>
                <div key={"loginPopUpModalSignupLink"} style={{marginTop:"60px", display:"inline-flex"}}>
                    <Button variant={"outlined"} type="button" className="btn btn-primary" style={{marginRight:"5px"}}
                            onClick={() => {setShowRegistrationForm(true)}}>
                        Sign Up
                    </Button>
                    <h6 style={{marginTop:"2px"}}> if you dont have an account yet.</h6>
                </div>
            </div>
        );
    }

    const getRegistrationForm = () => {
        return (
            <div>
                <form key={"registrationForm"}
                      style={{display:"grid", background : "rgba(135, 206, 235, 0.3", borderRadius:"30px"}}>
                    <h2>Registration Form</h2>

                    <img src={tempBrowsedImage} onError={getDefaultImageSrc} width={"150px"} height={"150px"} style={{margin:"0 0 0 35%"}}/>
                    <input type={"file"} style={{margin:"0 0 0 25%"}} accept={"image/jpeg, image/gif, image/png"}
                        onChange={userPhotoHandler} />
                    <h6 style={{padding:"0", margin:"0", color:"red"}}>
                        {errorMessage}</h6>
                    <TextField label={"First Name"} helperText={formFirstNameMessage}
                               error={formFirstNameError}
                        type={"text"} variant={"outlined"} name={"firstName"} placeholder={"First Name"} inputProps={{maxLength:64}}
                        style={{margin:"10px"}} required={true} onChange={firstNameHandler} className={"inputClasses"}/>
                    <TextField label={"Last Name"} helperText={formLastNameMessage}
                               error={formLastNameError}
                        type={"text"} variant={"outlined"} name={"lastName"} placeholder={"Last Name"} inputProps={{maxLength:64}}
                               style={{margin:"10px"}} required={true} onChange={lastNameHandler} className={"inputClasses"}/>
                    <TextField label={"Email"} helperText={formEmailMessage}
                               error={formEmailError}
                        type={"text"} variant={"outlined"} name={"email"} placeholder={"Email"} inputProps={{maxLength:128}}
                               style={{margin:"10px"}} required={true} onChange={emailHandler} className={"inputClasses"}/>
                    <TextField label={"Password"} helperText={formPasswordMessage}
                               error={formPasswordError}
                        type={"password"} variant={"outlined"} name={"password"} placeholder={"Password"} inputProps={{maxLength:256}}
                               style={{margin:"10px"}} required={true} onChange={passwordHandler} className={"inputClasses"}/>
                    <br/>
                    <div key={"registrationSubmitButtonDiv"} style={{height:"50px", width:"100%", paddingLeft:"5%"}}>
                        <Button variant={"outlined"} color={"secondary"} type={"button"} onClick={registerUserHandler}
                                style={{width:"120px"}} disabled={!(!formFirstNameError && !formLastNameError && !formEmailError && !formPasswordError && formSubmitButton)}>
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        );
    }


    return (
        <div id="navbar" className="navbar">
            <Link to={"/"} onClick={() => {
                navigate("/");
                window.location.reload();
                window.scrollTo({top: 0, left: 0, behavior: 'auto'});
            }}>
                <img src={navBarImage} width={"150px"} style={{float:"left", marginTop:"25px"}}/>
            </Link>
            <div className="homeLink">
                <Button variant={"outlined"} color={"primary"} style={{color:"black", fontSize:"20px", fontWeight:"bold", textDecoration:"underline", margin:"20px"}}
                        onClick={() => {
                            navigate('/');
                            window.location.reload();
                            window.scrollTo({top: 0, left: 0, behavior: 'auto'});
                        }}>
                    Auctions
                </Button>
                {
                    localStorage.getItem("token") !== null ?
                    <div>
                        <Button variant={"outlined"} color={"primary"} style={{color:"black", fontSize:"20px", fontWeight:"bold", textDecoration:"underline", margin:"20px"}}
                                onClick={() => {
                                    navigate("/myAuctions");
                                    window.scrollTo({top: 0, left: 0, behavior: 'auto'});
                                }}>
                            My Auctions
                        </Button>
                        <Button variant={"outlined"} color={"primary"} style={{color:"black", fontSize:"20px", fontWeight:"bold", textDecoration:"underline", margin:"20px"}}
                                onClick={() => {
                                    navigate("/listAuction");
                                    window.scrollTo({top: 0, left: 0, behavior: 'auto'});
                                }}>
                            Create Auction
                        </Button>
                    </div>  : ""
                }
            </div>
            <div className="account">
                <div>
                    <ul key={"usernameLabel"} id="userNameLabel">
                        {
                            userId && localStorage.getItem("token") ?
                                <div style={{margin:"0", padding:"0"}}>
                                <Link to={"/userProfile"} style={{textDecoration: "none", color:"black"}}>
                                    <li key={"loggedInUserName"} style={{fontWeight:"bold", fontSize:"20px"}}>{
                                        localStorage.getItem("lastName") ?
                                        localStorage.getItem("lastName")!.substring(0, 20) : ""
                                    }</li>
                                    <li key={"viewAccountLink"} className={"viewAccountLink"} style={{fontSize:"12px", color:"white"}}>View Account</li>

                                </Link>
                                    <li key={"logoutButton"}>
                                        <Button variant={"contained"} type="button" color={"warning"} onClick={() => logoutUserHandler()}
                                                style={{padding:"0 5px 0 5px", margin:"10px 5px 0 0", float:"right", fontSize:"12px"}}
                                                endIcon={<Logout/>} >
                                            Log out
                                        </Button>
                                    </li>
                                </div>
                                :
                            <li key={"loginNavBarButton"}>
                                <Button variant={"contained"} type="button" color={"inherit"} data-toggle="modal"
                                    data-target="#LogInModal" style={{padding:"0 5px 0 5px", margin:"20px 5px 0 0", float:"right", color:"black"}}
                                        endIcon={<Login/>}>
                                Login
                                </Button>
                            </li>
                        }
                    </ul>
                    <img src={"http://localhost:4941/api/v1/users/"+ userId +"/image"}
                        onError={getDefaultImageSrc}
                        alt="Not Available"
                        style={{padding: "0", margin: "0", width: "100px", height: "100px"}}
                    />
                </div>
            </div>

            <div key={"loginPopUp"}>
                <div>
                    <div className="modal fade" id="LogInModal" tabIndex={-1}
                         role="dialog"
                         aria-labelledby="LogInModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content" style={{width:"690px", marginLeft:"-20%", borderRadius:"30px"}}>
                                <div className="modal-body" style={{display:"flex", justifyContent:"center"}}>
                                    <Paper elevation={4} style={{padding: "50px", margin: "20px", marginTop: "0px", minWidth:"fit-content",
                                        width:"100%", borderRadius:"30px"}}>
                                        { showRegistrationForm ? getRegistrationForm() : getLoginForm()}
                                    </Paper>
                                </div>
                                <div className={"modal-footer"}>
                                    <button type="button" className="btn btn-primary" style={{borderRadius:"10px", color:"black", textDecoration:"underline", width:"100px"}}
                                            data-dismiss="modal" onClick={() => {setShowRegistrationForm(false); setUserEmail("");
                                                            setFirstName(""); setLastName(""); setTempBrowsedImage(""); setUserPassword("")
                                                            setErrorMessage(""); setErrorMessage("")}}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default NavBar;