import NavBar from "./NavBar";
import loadingImage from "../images/loading-load.gif";
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
import {useNavigate, useParams} from "react-router-dom";
import {getEndDateToLocalTime, getMinDateForAuctions} from "../services/CommonServices";

const EditAuction = () => {
    const {auctionId} = useParams();
    const navigate = useNavigate();
    const [errorFlag, setErrorFlag] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [postErrorMessage, setPostErrorMessage] = React.useState("");

    const [categories, setCategories] = React.useState<Array<Category>>([]);

    const [editTitle, setEditTitle] = React.useState("");
    const [titleError, setTitleError] = React.useState(false);
    const [editDescription, setEditDescription] = React.useState("");
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [editCategory, setEditCategory] = React.useState("");
    const [editReserve, setEditReserve] = React.useState(1);
    const [currentReserve, setCurrentReserve] = React.useState(1);
    const [reserveError, setReserveError] = React.useState(false);
    const [editEndDate, setEditEndDate] = React.useState("");
    const [endDateChanged, setEndDateChanged] = React.useState(false);

    const [isImageSelected, setIsImageSelected] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState("http://localhost:4941/api/v1/auctions/"+auctionId+"/image");
    const [imageToUpload, setImageToUpload] = React.useState([]);
    const [imageUploadType, setImageUploadType] = React.useState("");

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        marginTop: "0px",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "center",
    }

    const auctionPhoto: CSS.Properties = {
        // float: "left",
        border:"2px",
        minWidth:"550px",
        maxWidth:"1024px",
        minHeight:"300px",
        borderColor:"gray",
        borderStyle:"solid",
        borderRadius:"15px",
        overflow: "hidden",
    }

    React.useEffect(() => {
        getAuctionDetails();
        getCategories();
        setTimeout(()=> {}, 500);
    }, [])

    const getAuctionDetails = () => {
        axios.get("http://localhost:4941/api/v1/auctions/"+auctionId)
            .then((response) => {
                setEditTitle(response.data.title);
                setEditDescription(response.data.description);
                setEditCategory(response.data.categoryId);
                setEditReserve(response.data.reserve);
                setCurrentReserve(response.data.reserve);
                setEditEndDate(response.data.endDate);
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

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


    function updateListingRequest () {
        console.log(editEndDate)
        axios.patch("http://localhost:4941/api/v1/auctions/" + auctionId, {title: editTitle,
                description: editDescription,
                reserve: editReserve,
                categoryId: editCategory,
                endDate: endDateChanged ? editEndDate : new Date(editEndDate).toISOString().replace("T", " ").split(".")[0],
            }, {headers: {
                "X-Authorization": localStorage.getItem("token")!
            }
            })
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("");
                if (isImageSelected) {
                    axios.put("http://localhost:4941/api/v1/auctions/" + auctionId + "/image", imageToUpload, {
                        headers: {
                            "X-Authorization": localStorage.getItem("token")!,
                            "Content-Type" : imageUploadType
                        }
                    })
                        .then((subResponse) => {
                            setErrorFlag(false)
                            setErrorMessage("")
                            navigate("/auctions/" + auctionId);
                        }, (error) => {
                            setErrorFlag(true);
                            setPostErrorMessage(error.response.statusText);
                            setErrorMessage(error.toString());
                        })
                } else {
                    navigate("/auctions/" + auctionId)
                }
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
                setPostErrorMessage(error.response.statusText);
            })
    }

    const editTitleHandler = (event: any) => {
        setEditTitle(event.target.value);
        if (editTitle.length > 1) {
            setTitleError(false);
        } else {
            setErrorMessage("Title cannot be empty.");
            setTitleError(true);
        }
    }

    const editDescriptionHandler = (event: any) => {
        setEditDescription(event.target.value);
        if (editDescription.length <= 1) {
            setErrorMessage("Description cannot be empty.");
            setDescriptionError(true);
        } else {
            setDescriptionError(false);
        }
    }

    const editCategoryHandler = (event: any) => {
            setEditCategory(event.target.value);
    }

    const editReserveHandler = (event: any) => {
        if (Number(+event.target.value) > 0 && Number(+event.target.value) <= 99999999999){
            console.log("in")
            setReserveError(false);
            setEditReserve(+event.target.value);
        } else if (isNaN(event.target.value) || Number(+event.target.value) > 99999999999) {
            setReserveError(true);
        } else {
            setReserveError(true);
            setErrorMessage("You can only enter positive number (Min: 1 and Max: 99999999999)");
            setEditReserve(1);
        }
    }


    const uploadNewPhoto = (event : any) => {
        setIsImageSelected(true);
        setImageToUpload(event.target.files[0]);
        setImageUploadType(event.target.files[0].type);
        setSelectedImage(URL.createObjectURL(event.target.files[0]))
    }


    const getAuctionForm = () => {
        return (
            <div key={"editDataAuction"} style={{maxWidth:"800px"}}>
                <div key={"editImageDataNewAuction"} style={auctionPhoto}>
                    <img src={selectedImage}
                         style={{position:"relative", width:"100%", height:"100%", margin:"0", padding:"0"}}
                         alt="No Uploaded"
                    />
                </div>
                <label key={"uploadImageEditAuctionLabel"} htmlFor="contained-button-file">
                    <Button key={"uploadImageButtonEditAuction"} variant="contained" component="span" style={{marginTop:"5px"}}>
                        <input accept="image/jpeg image/png image/gif" id="contained-button-file" multiple type="file" hidden={true} key={"imageFileInputField"}
                               onChange={uploadNewPhoto}
                        />
                        Choose Image
                    </Button>
                </label>
                <div key={"addDataToEditAuctionDetails"} style={{float:"left", minWidth:"550px", maxWidth:"780px"}}>
                    <h3 style={{padding:"0", margin:"0"}}>Add Auction Details:</h3>
                    <h6 style={{padding:"0", margin:"0", color:"red"}}>
                        {postErrorMessage}</h6>
                    <TableContainer key={"dataEditAuctionContainer"}>
                        <Table key={"dataEditAuctionTable"}>
                            <TableHead key={"dataEditAuctionTableHead"}>
                                <TableRow key={"editAuctionDetails"} className='row-style'>
                                    <TableCell key={"editAuctionDetailsCell"} variant={"body"}>
                                        <FormControl fullWidth sx={{ m: 1 }} style={{margin:"0 0 15px 8px"}} key={"editAuctionTitle"}>
                                            <InputLabel htmlFor="outlined-adornment-amount" key={"editAuctionTitleLabel"}>Title</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-title"
                                                value={editTitle}
                                                required={true}
                                                error={titleError}
                                                onChange={editTitleHandler}
                                                label="Title"
                                                inputProps={{ maxLength:127}}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth sx={{ m: 1 }} style={{margin:"0 0 15px 8px"}} key={"editAuctionDescription"}>
                                            <InputLabel htmlFor="outlined-adornment-amount">Description</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-description"
                                                value={editDescription}
                                                multiline={true}
                                                error={descriptionError}
                                                onChange={editDescriptionHandler}
                                                label="Description"
                                                inputProps={{ maxLength:2047}}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth style={{margin:"0 0 15px 8px"}} key={"editAuctionCategory"}>
                                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                            <Select
                                                labelId="category-list"
                                                id="demo-simple-select"
                                                defaultValue={editCategory === "" ? "-1" : editCategory}
                                                required={true}
                                                label="Categories"
                                                onChange={editCategoryHandler}
                                            >
                                                <MenuItem value={"-1"} disabled={true}>Categories:</MenuItem>
                                                {categories.sort(
                                                    (a, b) => a.name > b.name ? 1 : -1
                                                ).map(item => <MenuItem key={item.categoryId.toString()}
                                                                        value={item.categoryId.toString()}>{item.name}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth sx={{ m: 1 }} style={{margin:"0 0 15px 8px"}} key={"editAuctionReserve"}>
                                            <InputLabel htmlFor="outlined-adornment-amount" key={"editAuctionReserveLabel"}>Reserve</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-amount"
                                                value={editReserve}
                                                error={reserveError}
                                                onChange={editReserveHandler}
                                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                label="Reserve "
                                            />
                                        </FormControl>
                                        <div style={{margin:"0 -8px 0 8px", display:"grid"}}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} key={"editAuctionEndDate"}>
                                                <DateTimePicker
                                                    key={"auctionEndDate"}
                                                    label="End Date&Time"
                                                    renderInput={(params) => <TextField {...params} />}
                                                    value={getEndDateToLocalTime(editEndDate)}
                                                    minDate={getMinDateForAuctions()}
                                                    onChange={(newValue) => {
                                                        setEditEndDate(newValue!.toISOString().replace("T", " ").split(".")[0]);
                                                        setEndDateChanged(true);
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                </TableRow>
                            </TableHead>
                        </Table>
                        <Button variant="contained"  style={{width:"100%", marginTop:"5px"}}
                                onClick={()=> {updateListingRequest(); window.scrollTo({top:0, left:0, behavior:"auto"})}}
                                disabled={!(!titleError && !descriptionError)}
                                >
                            Update
                        </Button>
                        <Button variant="contained" color={"error"} style={{width:"100%", marginTop:"5px"}}
                                onClick={() => {navigate("/auctions/"+auctionId); window.scrollTo({top: 0, left: 0, behavior: 'auto'});}}>
                            Cancel
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
                    {editCategory !== "" && editEndDate !== "" ? getAuctionForm() : <img src={loadingImage} /> }
                    <br/>
                </Paper>
            </div>
        </div>
    )
}


export default EditAuction;