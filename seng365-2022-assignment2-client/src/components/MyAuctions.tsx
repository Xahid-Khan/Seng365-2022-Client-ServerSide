import NavBar from "./NavBar";
import {Button, Paper} from "@mui/material";
import React from "react";
import CSS from "csstype";
import loadingImage from "../images/loading-load.gif"
import axios from "axios";
import {useNavigate} from "react-router-dom";
import list_of_auctions from "../services/list_of_auctions";

const MyAuctions = () => {
    window.scrollTo({top: 0, left: 0, behavior: 'auto'});
    const navigate = useNavigate();
    const [myAuctions, setMyAuctions] = React.useState([]);
    const [auctionsWithBids, setAuctionsWithBids] = React.useState([]);
    const [foundMyAuctions, setFoundMyAuctions] = React.useState(false);
    const [foundAuctionsWithBids, setFoundAuctionsWithBids] = React.useState(false);
    const [loadingData, setLoadingData] = React.useState(false);

    const [categories, setCategories] = React.useState([]);

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        marginTop: "0px",
        marginBottom: "-5px",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "center",
    }


    React.useEffect(
        () => {
            getAuctions();
            getCategories();
        }, [loadingData, foundMyAuctions]
    )

    const getAuctions = () => {
        const myAuctions = axios.get("http://localhost:4941/api/v1/auctions?count=5&startIndex=0&sellerId="+ Number(localStorage.getItem("userId")))
        const auctionsWithBids = axios.get("http://localhost:4941/api/v1/auctions?count=5&startIndex=0&bidderId="+ Number(localStorage.getItem("userId")))
            axios.all([auctionsWithBids, myAuctions])
            .then((response) => {
                setAuctionsWithBids(response[0].data.auctions)
                setMyAuctions(response[1].data.auctions)
                setLoadingData(true)
                if (response[1].data.auctions.length > 0) {
                    setFoundMyAuctions(true);
                } else {
                    setFoundMyAuctions(false)
                }
                response[0].data.auctions.length > 0 ? setFoundAuctionsWithBids(true) : setFoundAuctionsWithBids(false)
            }, (error) => {
                // setErrorFlag(true);
                // setErrorMessage(error.message);
            })
    }

    function getCategories () {
        axios.get("http://localhost:4941/api/v1/auctions/categories")
            .then((response) => {
                    setCategories(response.data);
                }, (error) => {
                    // setErrorFlag(true);
                    // setErrorMessage(error.toString)
                }
            )
    }

    return (
        <div>
            <div key={"body"}>
                {<NavBar/>}
                <h1>My Auctions: <h4>(First 5 only)</h4></h1>
                <Paper elevation={4} style={card} key={"BaseForAuctions"}>
                    {loadingData ?
                        foundMyAuctions ?
                            <div style={{width:"100%", display: "flex", flexFlow: "row wrap", justifyContent: "center"}}>
                                {list_of_auctions(myAuctions, categories)}
                            </div>
                            : <h1><br/><br/>You have no listings<br/><br/></h1>
                        :
                        <h1><br/><br/> <img src={loadingImage}/> <br/><br/></h1>
                    }
                    <br/>
                </Paper>
                <div style={{display:"grid", margin:"0 20px 0 20px"}}>
                    <Button variant={"contained"} disabled={!(myAuctions.length >= 5)}
                            onClick={()=> {navigate("/auctions?sellerId="+ localStorage.getItem("userId"))}}>
                        View All</Button>
                </div>
                <h1>Auctions with Bids: <h4>(First 5 only)</h4></h1>
                <Paper elevation={4} style={card} key={"BaseForAuctions"}>
                    {loadingData ?
                        foundAuctionsWithBids ?
                            <div style={{width:"100%", display: "flex", flexFlow: "row wrap", justifyContent: "center"}}>
                                {list_of_auctions(auctionsWithBids, categories)}
                            </div>
                            : <h1><br/><br/>You have not bid on any Listings<br/><br/></h1>
                        :
                        <h1><br/><br/> <img src={loadingImage}/> <br/><br/></h1>
                    }
                    <br/>
                </Paper>
                <div style={{display:"grid", margin:"0 20px 0 20px"}}>
                    <Button variant={"contained"} disabled={!(auctionsWithBids.length >= 5)}
                            onClick={()=> {navigate("/auctions?bidderId="+ localStorage.getItem("userId"))}}>
                        View All</Button>
                </div>
            </div>
        </div>
    );
}


export default MyAuctions;