import NavBar from "./NavBar";
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import React from "react";
import CSS from "csstype";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {
    getCategoryName,
    getDefaultImageSrc,
    getEndDateToLocalTime,
    getRemainingTime,
    isReserveMet
} from "../services/CommonServices";
import {LocalOffer} from "@mui/icons-material";


function AuctionDetails () {
    const {auctionId} = useParams();
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [bidList, setBidList] = React.useState<Array<any>>([]);
    const [highestBidderId, setHighestBidderId] = React.useState(0);
    const [categoryId, setCategoryId] = React.useState(0);
    const [placeBidButton, setPlaceBidButton] = React.useState(true)
    const [relevantAuctions, setRelevantAuctions] = React.useState<Array<Auction>>([]);
    const navigate = useNavigate();
    const [showDeleteAuctionDialog, setShowDeleteAuctionDialog] = React.useState(false);
    const [bidAmount, setBidAmount] = React.useState<number>();
    const [bidAmountError, setBidAmountError] = React.useState(false);
    const [auctionDetails, setAuctionDetails] = React.useState<Auction>(({title: "",
                                                                        description: "",
                                                                        auctionId: 0,
                                                                        highestBid: 0,
                                                                        categoryId: 0,
                                                                        numBids: 0,
                                                                        endDate: "",
                                                                        reserve: 0,
                                                                        sellerId: 0,
                                                                        sellerFirstName: "",
                                                                        sellerLastName: ""})
                                                                    );


    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        marginTop: "0px",
        minWidth: "660px",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "space-around",
    }

    const auctionPhoto: CSS.Properties = {
        border:"2px",
        minWidth:"550px",
        maxWidth: "1024px",
        minHeight:"300px",
        borderColor:"gray",
        borderStyle:"solid",
        borderRadius:"15px",
        overflow: "hidden",
    }

    React.useEffect(
        () => {
            getAuctionDetails ()
        }, [highestBidderId, auctionId, categoryId]
    )


    function getAuctionDetails () {

        const requestAuctions = axios.get("http://localhost:4941/api/v1/auctions/"+auctionId);
        const requestBidHistory = axios.get("http://localhost:4941/api/v1/auctions/" +auctionId + "/bids");
        const requestCategories = axios.get("http://localhost:4941/api/v1/auctions/categories");

        Promise.all([requestAuctions, requestCategories, requestBidHistory])
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuctionDetails(response[0].data)
                setCategoryId(response[0].data.categoryId)
                setCategories(response[1].data)
                setBidList(response[2].data)
                if (response[2].data.length > 0) {
                    setHighestBidderId(response[2].data.filter((bidder: Bidder) => (bidder.amount === response[0].data.highestBid))[0].bidderId)
                }
                axios.get("http://localhost:4941/api/v1/auctions?categoryIds=" + response[0].data.categoryId)
                    .then((subResoponse) => {
                        setRelevantAuctions(subResoponse.data.auctions)
                        }, (error) => {
                        setErrorFlag(true)
                        setErrorMessage(error.toString);
                        }
                    )

            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString)
            })
    }


    const deleteAuctionRequest = () => {
        axios.delete("http://localhost:4941/api/v1/auctions/"+ auctionId,  {
            headers: {
                "X-Authorization": localStorage.getItem("token")!
            }
        })
            .then((response) => {
                window.scrollTo({top: 0, left: 0, behavior: 'auto'});
                navigate("/myAuctions");
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString())
            })
    }


    const placeBidRequest = () => {
        axios.post("http://localhost:4941/api/v1/auctions/"+ auctionId+ "/bids", {amount:Number(bidAmount)}, {
            headers: {
                "X-Authorization": localStorage.getItem("token")!
            }
        })
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                getAuctionDetails()
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
        setBidAmount(0);
    }

    const bidAmountHandler = (event: any) => {
        if (isNaN(+event.target.value) || Number(event.target.value) >= 9999999999){
            setBidAmountError(true)
            setPlaceBidButton(true);
            setErrorMessage("Bid Must be greater than current bid and less than 9999999999")
            // setBidAmount(0);
        } else {
            setBidAmount(+event.target.value);
            setErrorMessage("")
            setBidAmountError(false)
        }
        if (Number(+event.target.value) > auctionDetails.highestBid && Number(event.target.value) < 9999999999) {
            setPlaceBidButton(false)
        } else {
            setPlaceBidButton(true)
        }
    }

    const deleteAuctionDialogHandler = () => {
        setShowDeleteAuctionDialog(!showDeleteAuctionDialog);
    }

    function renderAuctionDetails () {
        const highestBidder = bidList.filter(item => item.bidderId === highestBidderId);
        return (
            <div style={{maxWidth:"1024px"}}>
                <div style={auctionPhoto} key={"auctionImage" + auctionId}>
                    <img src={"http://localhost:4941/api/v1/auctions/"+ auctionId+ "/image"}
                         style={{position:"relative", width:"100%", height:"100%", margin:"0", padding:"0"}}
                         alt="Not Available"
                    />
                </div>
                <div key={"auctionDetails" + auctionId} style={{float:"left", minWidth:"550px", width:"100%"}}>
                    <h3 style={{padding:"0", margin:"0"}}>Auction Details:</h3>
                    {
                        auctionDetails.highestBid >= auctionDetails.reserve ?
                            <p style={{marginBottom:"-15px", paddingLeft:"15px", float:"left", textAlign:"left", fontWeight:"bold", width:"200px", color:"green"}}>
                                Reserve Met
                            </p>
                            :
                            <p style={{marginBottom:"-15px", paddingLeft:"15px", float:"left", textAlign:"left", fontWeight:"bold", width:"200px", color:"red"}}>
                                Reserve Not Met
                            </p>
                    }
                    {
                        placeBidOnAuction()
                    }
                    <TableContainer>
                        <Table key={"auctionDetailsTable" + auctionId}>
                            <TableHead>
                                <TableRow key={"biddersDetails" + auctionId} className='row-style'>
                                    <TableCell key={"bidLabel" + auctionId} variant={"head"} style={{fontWeight:"bold", width:"120px"}}>Current Bid</TableCell>
                                    <TableCell key={"bidInfo" + auctionId} variant={"body"} style={{objectPosition:"center"}}>
                                        <div style={{float:"left", margin:"12px 0 0 0"}}>
                                            $ {auctionDetails.highestBid > 0 ? auctionDetails.highestBid : 0}.00
                                        </div>
                                        {
                                            highestBidderId ?
                                                <div style={{float:"left", wordBreak:"break-all", maxWidth:"40%"}}>
                                                    <img
                                                        src={"http://localhost:4941/api/v1/users/" + highestBidderId + "/image"}
                                                        onError={getDefaultImageSrc}
                                                        alt={"Not Available"}
                                                        style={{width: "50px", height: "50px", margin: "0 5px 0 5px"}}
                                                    />
                                                    {highestBidder[0].firstName}
                                                    {" "}
                                                    {highestBidder[0].lastName}
                                                </div>
                                                : ""
                                        }
                                        <div style={{float:"right"}}>
                                            {generateBidListPopup()}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow key={"reserveDetails" + auctionId} className='row-style'>
                                    <TableCell key={"reserveLabel" + auctionId} variant={"head"} style={{fontWeight:"bold", width:"120px"}}>Reserve</TableCell>
                                    <TableCell key={"reserve" + auctionId} variant={"body"}>$ {auctionDetails.reserve}</TableCell>
                                </TableRow>
                                <TableRow key={"auctionTitleDetails" + auctionId} className='row-style'>
                                    <TableCell key={"titleLabel" + auctionId} variant={"head"} style={{fontWeight:"bold", width:"120px"}}>Title</TableCell>
                                    <TableCell key={"titleInfo" + auctionId} variant={"body"}>{auctionDetails.title}</TableCell>
                                </TableRow>
                                <TableRow key={"auctionDescription" + auctionId} className='row-style'>
                                    <TableCell key={"descriptionLabel" + auctionId} variant={"head"} style={{fontWeight:"bold", width:"120px"}}>Description</TableCell>
                                    <TableCell key={"description" + auctionId} variant={"body"}>{auctionDetails.description}</TableCell>
                                </TableRow>
                                <TableRow key={"categoryDetails" + auctionId} className='row-style'>
                                    <TableCell key={"categoryLabel" + auctionId} variant={"head"} style={{fontWeight:"bold", width:"120px"}}>Category</TableCell>
                                    <TableCell key={"category" + auctionId} variant={"body"}>
                                        <p style={{padding:"10px 0 0 0", margin:"0", float:"left"}}>
                                            {getCategoryName(auctionDetails.categoryId, categories)}
                                        </p>
                                        <Button variant={"contained"} type="button" className="btn btn-primary" data-toggle="modal"
                                                data-target="#relevantListModal" disabled={relevantAuctions.length  <= 1} style={{float:"right"}}>
                                            Similar Auctions
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow key={"bidsDetails" + auctionId} className='row-style'>
                                    <TableCell key={"bidLabel" + auctionId} variant={"head"} style={{fontWeight:"bold", width:"120px"}}>Bids</TableCell>
                                    <TableCell key={"bids" + auctionId} variant={"body"}>{auctionDetails.numBids} (total number of bids)</TableCell>
                                </TableRow>
                                <TableRow key={"endDateDetails" + auctionId} className='row-style'>
                                    <TableCell key={"endDateLabel" + auctionId} variant={"head"} style={{fontWeight:"bold", width:"0"}}>End Date</TableCell>
                                    <TableCell key={"endDate" + auctionId} variant={"body"} style={{display:"table-cell", width:"100%"}}>
                                        {getEndDateToLocalTime(auctionDetails.endDate)}
                                    </TableCell>
                                </TableRow>
                                <TableRow key={"sellerDetails" + auctionId} className='row-style'>
                                    <TableCell key={"sellerLabel" + auctionId} variant={"head"} style={{fontWeight:"bold", width:"120px"}}>Seller</TableCell>
                                    <TableCell key={"sellers" + auctionId} variant={"body"}>
                                        <div style={{float:"left", display:"grid"}}>
                                            {auctionDetails.sellerFirstName} {auctionDetails.sellerLastName}
                                            <img src={"http://localhost:4941/api/v1/users/"+ auctionDetails.sellerId + "/image"}
                                                 onError={getDefaultImageSrc}
                                                 style={{position:"relative", width:"100px", height:"100px"}}
                                                 alt="No Uploaded"
                                            />
                                        </div>
                                        <Link to={{pathname: "/auctions?sellerId=" + auctionDetails.sellerId.toString()}}
                                              style={{float:"right", marginTop:"3.5%"}} onClick={()=> window.scrollTo({top: 0, left: 0, behavior: 'auto'})}>
                                            <Button variant={"outlined"}>All Listings for this Seller</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                        {
                            (getRemainingTime(auctionDetails.endDate) !== "Closed") ?

                                (localStorage.getItem("userId") === auctionDetails.sellerId.toString()) ?
                                    <div>
                                        {
                                            auctionDetails.highestBid > 0 ?
                                                ""
                                            :
                                            <>
                                                <Button key={"editAuctionButton" + auctionId} variant="contained"
                                                        color={"info"} onClick={() => {navigate("/editAuction/" + auctionDetails.auctionId);
                                                            window.scrollTo({top: 0, left: 0, behavior: 'auto'})}}
                                                        style={{float: "left", marginTop: "0px", marginLeft: "15px"}}>
                                                    Edit Auction</Button>

                                                <Button key={"deleteAuctionButton" + auctionId} variant="contained"
                                                        color={"info"}
                                                        style={{float: "right", marginTop: "0px", marginRight: "15px"}}
                                                        onClick={deleteAuctionDialogHandler}>
                                                    Delete Auction</Button>
                                            </>
                                        }
                                    </div>
                                    : ""
                                :
                                ""
                        }
                    </TableContainer>
                    <>
                        <Dialog open={showDeleteAuctionDialog}
                                onClose={deleteAuctionDialogHandler}
                                aria-labelledby={"alert-dialog-title"}
                                aria-describedby={"alert-dialog-description"}>
                            <DialogTitle>
                                Confirmation Required
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you Sure, You would like to delete this auction?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button color={"error"} variant={"contained"} onClick={()=> deleteAuctionRequest()}>
                                    Delete
                                </Button>
                                <Button color={"info"} variant={"contained"}
                                    onClick={deleteAuctionDialogHandler}>
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                </div>
            </div>
        );
    }

    const placeBidOnAuction = () => {
        return (
            <div>
                {
                    (getRemainingTime(auctionDetails.endDate) !== "Closed") ?

                        (localStorage.getItem("userId") !== auctionDetails.sellerId.toString()) ?
                            <Button key={"placeBid" + auctionId} variant="outlined" color={"success"} data-toggle={"modal"}
                                    style={{float: "right", marginTop: "-4px", marginRight: "15px"}} data-target={"#placeBidOnAuctionModal"}>
                                Place Bid</Button>
                            : ""
                        :
                        <Button key={"placeBid" + auctionId} variant="outlined" color={"error"} disabled={true}
                                style={{float: "right", marginTop: "-4px", marginRight: "15px", fontWeight:"bold"}}>CLOSED</Button>
                }

                <div key={"placeBidOnAuctionKey"} className="modal fade" id="placeBidOnAuctionModal" tabIndex={-1}
                     role="dialog"
                     aria-labelledby="placeBidOnAuctionLabel" aria-hidden="true">
                    <div key={"placeBidOnAuctionModal"} className="modal-dialog" role="document">
                        <div key={"placeBidOnAuctionContent"} className="modal-content" style={{marginTop:"25%"}}>
                            <div key={"placeBidOnAuctionModalBody"} className="modal-body">
                                <div>
                                    <p> {auctionDetails.title} </p>
                                </div>
                                <div>
                                    <p style={{float:"left", textAlign:"right", width:"49%", marginRight:"5%"}}> Current Bid: </p>
                                    <p style={{float:"right", textAlign:"left", width:"44%"}}>
                                        {auctionDetails.highestBid > 0 ? "$ " + auctionDetails.highestBid : "$ 0.00"} </p>
                                </div>
                                <h6 style={{padding:"0", margin:"0", color:"red"}}>
                                    {errorMessage}</h6>
                                {
                                    localStorage.getItem("token") !== null ?
                                        <div>
                                            <div>
                                                <FormControl fullWidth sx={{ m: 1 }}>
                                                    <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                                    <OutlinedInput
                                                        id="outlined-adornment-amount"
                                                        error={bidAmountError}
                                                        value={bidAmount}
                                                        onChange={bidAmountHandler}
                                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                        label="Amount"
                                                    />
                                                </FormControl>
                                            </div>
                                            <div>
                                                <Button type="button" variant={"contained"} className="btn btn-primary" color={"success"} endIcon={<LocalOffer/>}
                                                        data-dismiss="modal" style={{margin:"15px 20px 10px 0", width:"180px", float:"right"}} onClick={placeBidRequest}
                                                        disabled={placeBidButton}>
                                                    Place Bid
                                                </Button>
                                            </div>
                                        </div>
                                    :
                                        <div style={{color:"red"}}>
                                            **********************************
                                            <h2>Please Login to place bid</h2>
                                            **********************************
                                        </div>
                                }
                            </div>
                            <Button type="button" className="btn btn-secondary" variant={"contained"} color={"info"}
                                    data-dismiss="modal">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    const errorMessagePopup = () => {
        return (
            <div>
                <h1>{errorMessage}</h1>
            </div>
        );
    }

    const generateRelevantAuctions = () => {
        return (
            <div>
                <div key={"relevantListModal"} className="modal fade" id="relevantListModal" tabIndex={-1}
                     role="dialog"
                     aria-labelledby="relevantListModalLabel" aria-hidden="true">
                    <div key={"relevantDialogModal"} className="modal-dialog" role="document">
                        <div key={"relevantModalContent"} className="modal-content" style={{width:"fit-content", marginLeft:"-25%"}}>
                            <div key={"relevantModalBody"} className="modal-body">
                                <Table>
                                    <TableHead>
                                        <TableRow key={"relevantTableHeading"}>
                                            <TableCell variant={"head"} style={{fontWeight:"bold", width:"120px"}}>Image</TableCell>
                                            <TableCell variant={"head"} style={{fontWeight:"bold", width:"300px"}}>Title</TableCell>
                                            <TableCell variant={"head"} style={{fontWeight:"bold", width:"220px"}}>Bid</TableCell>
                                            <TableCell variant={"head"} style={{fontWeight:"bold", width:"230px"}}>Reserve</TableCell>
                                            <TableCell variant={"head"} style={{fontWeight:"bold", width:"220px"}}>Status</TableCell>
                                            <TableCell variant={"head"} style={{fontWeight:"bold", width:"220px"}}>Closing</TableCell>
                                            <TableCell variant={"head"} style={{fontWeight:"bold", width:"220px"}}>Go To</TableCell>
                                        </TableRow>
                                        {
                                            categoryId > 0 ?
                                            relevantAuctions.filter(item => item.auctionId != Number(auctionId)).map(relevantAuction =>
                                                <TableRow key={"relevantTableRow" + relevantAuction.auctionId} className='row-style'>
                                                    <TableCell variant={"head"} style={{fontWeight:"bold", width:"120px"}}>{
                                                        <img
                                                            src={"http://localhost:4941/api/v1/auctions/"+relevantAuction.auctionId+"/image"}
                                                            alt="Not Available"
                                                            style={{padding: "0", margin: "0", width: "100px", height: "100px"}}
                                                        />
                                                    }</TableCell>
                                                    <TableCell variant={"body"} style={{width:"300px"}}>
                                                        {relevantAuction.title}
                                                    </TableCell>
                                                    <TableCell variant={"body"} style={{width:"220px"}}>${relevantAuction.highestBid > 0 ? relevantAuction.highestBid : 0}</TableCell>
                                                    <TableCell variant={"body"} style={{width:"230px"}}>${relevantAuction.reserve}</TableCell>
                                                    <TableCell variant={"body"} style={{width:"220px"}}>{
                                                        isReserveMet(relevantAuction) ?
                                                            <p style={{fontStyle:"italic", fontSize:"16px", color:"green"}}>
                                                                Reserve Met
                                                            </p>
                                                            :
                                                            <p style={{fontStyle:"italic", fontSize:"16px", color:"red"}}>
                                                                Not Met
                                                            </p>
                                                    }</TableCell>

                                                    <TableCell variant={"body"} style={{width:"230px"}}>{getRemainingTime(relevantAuction.endDate)}</TableCell>
                                                    <TableCell variant={"body"} style={{width:"230px"}}>
                                                        <Link to={{pathname: "/auctions/" + relevantAuction.auctionId.toString()}}
                                                              style={{textDecoration:"none"}}
                                                        >
                                                            <button type="button" className="btn btn-primary"
                                                                    data-dismiss="modal" onClick={() => navigate("/auctions/" + relevantAuction.auctionId)}>
                                                                View
                                                            </button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>

                                            ) : ""
                                        }
                                    </TableHead>
                                </Table>
                            </div>
                            <button type="button" className="btn btn-primary"
                                    data-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const generateBidListPopup = () => {
        return (
            <div>
                <Button variant={"contained"} type="button" className="btn btn-primary" data-toggle="modal"
                        data-target="#bidderListModal" disabled={bidList.length == 0}>
                    Bids/Bidders List
                </Button>
                <div className="modal fade" id="bidderListModal" tabIndex={-1}
                     role="dialog"
                     aria-labelledby="bidderListModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" style={{width:"690px", marginLeft:"-20%", overflowY:"scroll"}}>
                            <div className="modal-body">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell variant={"head"} style={{fontWeight:"bold", width:"120px"}}>Bid</TableCell>
                                            <TableCell variant={"head"} style={{fontWeight:"bold", width:"300px"}}>Date&Time</TableCell>
                                            <TableCell variant={"head"} style={{fontWeight:"bold", width:"220px"}}>First Name</TableCell>
                                            <TableCell variant={"head"} style={{fontWeight:"bold", width:"230px"}}>Last Name</TableCell>
                                            <TableCell variant={"head"} style={{fontWeight:"bold", width:"220px"}}>Photo</TableCell>
                                        </TableRow>
                                        {
                                            bidList.map(bidder =>
                                                <TableRow className='row-style'>
                                                    <TableCell variant={"head"} style={{fontWeight:"bold", width:"120px"}}>${bidder.amount}</TableCell>
                                                    <TableCell variant={"body"} style={{width:"300px"}}>
                                                        {new Date(bidder.timestamp).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell variant={"body"} style={{width:"220px"}}>{bidder.firstName}</TableCell>
                                                    <TableCell variant={"body"} style={{width:"230px"}}>{bidder.lastName}</TableCell>
                                                    <TableCell variant={"body"} style={{width:"220px"}}>
                                                        <img src={"http://localhost:4941/api/v1/users/"+ bidder.bidderId + "/image"}
                                                             onError={getDefaultImageSrc}
                                                             style={{position:"relative", width:"50px", height:"50px", margin:"0", padding:"0"}}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableHead>
                                </Table>
                            </div>
                            <button type="button" className="btn btn-primary"
                                    data-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {<NavBar/>}
            <Paper elevation={4} style={card} key={"base."+auctionId}>
                <div>
                    {errorFlag ? errorMessagePopup() : renderAuctionDetails()}
                </div>
                <div style={{width:"100%"}}>
                    {generateRelevantAuctions()}
                </div>

            </Paper>
        </div>
    );
}

export default AuctionDetails;