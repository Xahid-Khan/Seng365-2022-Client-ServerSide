import NavBar from "./NavBar";
import {
    Button,
    FormControl, InputAdornment,
    InputLabel, MenuItem,
    OutlinedInput,
    Paper, Select,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField
} from "@mui/material";
import React from "react";
import CSS from "csstype";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {getMinDateForAuctions} from "../services/CommonServices";

const ListAnAuction = () => {
    const navigate = useNavigate();
    const [errorFlag, setErrorFlag] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [postErrorMessage, setPostErrorMessage] = React.useState("");

    const [isImageSelected, setIsImageSelected] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState("");
    const [imageToUpload, setImageToUpload] = React.useState([]);
    const [imageUploadType, setImageUploadType] = React.useState("");

    const [auctionTitle, setAuctionTitle] = React.useState("");
    const [titleError, setTitleError] = React.useState(false);

    const [auctionDescription, setAuctionDescription] = React.useState("");
    const [descriptionError, setDescriptionError] = React.useState(false);

    const [auctionReserve, setAuctionReserve] = React.useState(1);
    const [reserveError, setReserveError] = React.useState(false);

    const [auctionEndDate, setAuctionEndDate] = React.useState<Date | null>();
    const [endDateError, setEndDateError] = React.useState(false);

    const [auctionCategory, setAuctionCategory] = React.useState("-1");
    const [categoryError, setCategoryError] = React.useState(false);

    const [postingEndDate, setPostingEndDate] = React.useState<string>(getMinDateForAuctions().toString());
    const [readyToSubmit, setReadyToSubmit] = React.useState(false);


    const [categories, setCategories] = React.useState<Array<Category>>([]);

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        marginTop: "0px",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "center",
    }

    const auctionPhoto: CSS.Properties = {
        border:"2px",
        minWidth:"550px",
        maxWidth:"800px",
        minHeight:"300px",
        borderColor:"gray",
        borderStyle:"solid",
        borderRadius:"15px",
        overflow: "hidden",
    }

    React.useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: 'auto'});
        getCategories()
    }, [errorFlag, errorMessage, isImageSelected, selectedImage])


    function getCategories () {
        axios.get("http://localhost:4941/api/v1/auctions/categories")
            .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setCategories(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString())
                }
            )
    }


    function postListingRequest () {
        axios.post("http://localhost:4941/api/v1/auctions",
            {title: auctionTitle,
                 description: auctionDescription,
                 reserve: auctionReserve,
                 categoryId: auctionCategory,
                 endDate: new Date(postingEndDate).toISOString().replace("T", " ").split(".")[0],
                }, {headers: {
                        "X-Authorization": localStorage.getItem("token")!
                        }
                })
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("");
                if (isImageSelected) {
                    axios.put("http://localhost:4941/api/v1/auctions/" + response.data.auctionId + "/image", imageToUpload, {
                        headers: {
                            "X-Authorization": localStorage.getItem("token")!,
                            "Content-Type" : imageUploadType
                        }
                    })
                        .then((subResponse) => {
                            setErrorFlag(false)
                            setErrorMessage("")
                            navigate("/auctions/" + response.data.auctionId);
                        }, (error) => {
                            setErrorFlag(true);
                            setPostErrorMessage(error.response.statusText);
                            setErrorMessage(error.toString());
                        })
                } else {
                    navigate("/auctions/" + response.data.auctionId)
                }
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
                setPostErrorMessage(error.response.statusText);
            })
    }

    const SelectedAuctionImageHandler = (event: any) => {
        if ("image/jpeg, image/png, image/gif".includes(event.target.files[0].type)) {
            setIsImageSelected(true);
            setSelectedImage(URL.createObjectURL(event.target.files[0]));
            setImageToUpload(event.target.files[0]);
            setImageUploadType(event.target.files[0].type);
            setPostErrorMessage("");
        } else {
            event.target.value = [];
            setSelectedImage("");
            setIsImageSelected(false);
            setPostErrorMessage("Invalid Image File Type");
        }

    }

    const auctionTitleHandler = (event: any) => {
        setAuctionTitle(event.target.value);
        if (event.target.value.length > 0 ) {
            setTitleError(false);
            setPostErrorMessage("")
        } else {
            setTitleError(true);
            setPostErrorMessage("Title must be between 1 and 127 Characters");
        }
    }

    const auctionDescriptionHandler = (event: any) => {
        setAuctionDescription(event.target.value);
        if (event.target.value.length > 0 ) {
            setDescriptionError(false)
            setPostErrorMessage("");
        } else {
            setDescriptionError(true);
            setPostErrorMessage("Description must be between 1 and 2047 Characters");
        }
    }

    const auctionCategoryHandler = (event: any) => {
        if (event.target.value !== "-1" ) {
            setAuctionCategory(event.target.value);
            setCategoryError(false);
        } else {
            setCategoryError(true);
        }
    }

    const auctionReserveHandler = (event: any) => {
        if (event.target.value.length > 0 && event.target.value > 0 && Number(event.target.value) <= 99999999999) {
            setReserveError(false);
            setAuctionReserve(+event.target.value);
            setPostErrorMessage("");
        } else {
            setReserveError(true);
            setAuctionReserve(1);
            setPostErrorMessage("Reserve can only be between $1 and $99999999999");
        }
    }


    const getAuctionForm = () => {
        return (
            <div key={"dataNewAuction"} style={{maxWidth:"800px"}}>
                <div key={"imageDataNewAuction"} style={auctionPhoto}>
                    <img src={selectedImage}
                         style={{position:"relative", width:"100%", height:"100%", margin:"0", padding:"0"}}
                         alt="No Uploaded" hidden={!isImageSelected}
                    />
                </div>
                <label key={"uploadImageNewAuctionLabel"} htmlFor="contained-button-file">
                    <Button key={"uploadImageButtonNewAuction"} variant="contained" component="span" style={{marginTop:"5px"}}>
                        <input accept="image/jpeg, image/png, image/gif" id="contained-button-file" multiple type="file" hidden={true} key={"imageFileInputField"}
                               onChange={SelectedAuctionImageHandler}
                        />
                        Choose Image
                    </Button>
                </label>
                <div key={"addDataToNewAuctionDetails"} style={{float:"left", minWidth:"550px", maxWidth:"780px"}}>
                    <h3 style={{padding:"0", margin:"0"}}>Add Auction Details:</h3>
                    <h6 style={{padding:"0", margin:"0", color:"red"}}>
                        {postErrorMessage}</h6>
                    <TableContainer key={"dataNewAuctionContainer"}>
                        <Table key={"dataNewAuctionTable"}>
                            <TableHead key={"dataNewAuctionTableHead"}>
                                <TableRow key={"fillAuctionDetails"} className='row-style'>
                                    <TableCell key={"auctionDetailsCell"} variant={"body"}>
                                        <FormControl fullWidth sx={{ m: 1 }} style={{margin:"0 0 15px 8px"}} key={"auctionTitle"}>
                                            <InputLabel htmlFor="outlined-adornment-amount" key={"auctionTitleLabel"}>Title</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-title"
                                                value={auctionTitle}
                                                required={true}
                                                error={titleError}
                                                onChange={auctionTitleHandler}
                                                label="Title"
                                                inputProps={{ maxLength:127}}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth sx={{ m: 1 }} style={{margin:"0 0 15px 8px"}} key={"auctionDescription"}>
                                            <InputLabel htmlFor="outlined-adornment-amount">Description</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-description"
                                                value={auctionDescription}
                                                multiline={true}
                                                error={descriptionError}
                                                onChange={auctionDescriptionHandler}
                                                label="Description"
                                                inputProps={{ maxLength:2047}}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth style={{margin:"0 0 15px 8px"}} key={"auctionCategory"}>
                                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                            <Select
                                                labelId="category-list"
                                                id="demo-simple-select"
                                                defaultValue={"-1"}
                                                required={true}
                                                error={categoryError}
                                                label="Category"
                                                onChange={auctionCategoryHandler}
                                            >
                                                <MenuItem value={"-1"} disabled={true}>Categories:</MenuItem>
                                                {categories.sort(
                                                    (a, b) => a.name > b.name ? 1 : -1
                                                ).map(item => <MenuItem value={item.categoryId.toString()}>{item.name}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth sx={{ m: 1 }} style={{margin:"0 0 15px 8px"}} key={"auctionReserve"}>
                                            <InputLabel htmlFor="outlined-adornment-amount" key={"auctionReserveLabel"}>Reserve</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-amount"
                                                value={auctionReserve}
                                                error={reserveError}
                                                onChange={auctionReserveHandler}
                                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                label="Reserve "
                                            />
                                        </FormControl>
                                        <FormControl sx={{ m: 1 }} style={{margin:"0 140px 0 15px", width:"276px"}} key={"auctionStartDate"}>
                                            <InputLabel htmlFor="outlined-adornment-amount">Start Date</InputLabel>
                                            <OutlinedInput
                                                disabled={true}
                                                id="outlined-adornment-StartDate"
                                                value={
                                                        new Date().toLocaleString("en-US", {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false
                                                        })
                                                    }
                                                label="Start Date"
                                            />
                                        </FormControl>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} key={"auctionEndDate"}>
                                            <DateTimePicker
                                                key={"auctionEndDate"}
                                                label="End Date&Time"
                                                renderInput={(params) => <TextField {...params} />}
                                                value={postingEndDate}
                                                minDate={getMinDateForAuctions()}
                                                onChange={(newValue) => {
                                                    setPostingEndDate(newValue!.toLocaleString());
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                </TableRow>
                            </TableHead>
                        </Table>
                        <Button variant="contained" onClick={postListingRequest} style={{width:"100%", marginTop:"5px"}}
                                disabled={!(!titleError && !descriptionError && isImageSelected &&
                                    auctionTitle.length > 0 && auctionDescription.length > 0 && auctionCategory !== "-1")}>
                            Submit Listing
                        </Button>
                    </TableContainer>
                </div>
            </div>
        )
    }


    return (
        <div>
            <div key={"body"}>
                {<NavBar/>}
                <Paper elevation={4} style={card} key={"BaseForCreateAuctions"}>
                    {getAuctionForm()}
                    <br/>
                </Paper>
            </div>
        </div>
    )
}


export default ListAnAuction;