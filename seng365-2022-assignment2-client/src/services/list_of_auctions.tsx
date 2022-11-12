import {Paper} from "@mui/material";
import {Link} from "react-router-dom";
import {getCategoryName, getDefaultImageSrc, getRemainingTime, isReserveMet} from "./CommonServices";
import React from "react";
import CSS from "csstype";

function list_of_auctions (allAuctions: Auction[], categories: Category[]) {
    const auctionCard: CSS.Properties = {
        padding: "5px",
        margin:"20px",
        width:"300px",
        height:"525px",
        float:"left",

    }

    if (allAuctions.length > 0) {
        const auctions = allAuctions;
        return (
            auctions.map(
                auction =>
                    <div key={"auctionDisplayDiv" + auction.auctionId}>
                        <Paper elevation={2} style={auctionCard} key={"auctionPaper" + auction.auctionId}>
                            <Link to={"/auctions/" + auction.auctionId} onClick={() => window.scrollTo({top: 0, left: 0, behavior: 'auto'})}
                                  style={{textDecoration: "none", color: "black"}}>
                                <div key={"auctionImage" + auction.auctionId} style={{
                                    display: "inline-block",
                                    height: "47%",
                                    verticalAlign: "middle",
                                    padding: "0",
                                    margin: "0"
                                }}>
                                    <img
                                        src={"http://localhost:4941/api/v1/auctions/" + auction.auctionId + "/image"}
                                        onError={getDefaultImageSrc}
                                        alt="Not Available"
                                        style={{padding: "0", margin: "0", width: "280px", height: "245px"}}
                                    />
                                </div>
                                <div key={"auctionContent" + auction.auctionId} style={{
                                    display: "inline-list-item",
                                    height: "52%",
                                    alignContent: "absolute",
                                    padding: "6px 0px 1px 0px"
                                }}>
                                    <div key={"auctionTitle" + auction.auctionId}
                                         style={{height: "60px", verticalAlign: "middle"}}>
                                        <h6 style={{
                                            fontWeight: "bold",
                                            height: "100%",
                                            verticalAlign: "middle",
                                            display: "inline",
                                            wordBreak: "break-all"
                                        }}>{auction.title.length > 50 ? auction.title.substring(0, 50) + " ..." : auction.title}</h6>
                                    </div>
                                    <div key={"auctionBid" + auction.auctionId}
                                         style={{height: "30px", verticalAlign: "middle"}}>
                                        <p style={{
                                            float: "left",
                                            fontSize: "16px",
                                            width: "33%",
                                            textAlign: "left",
                                            height: "12px"
                                        }}>
                                            Bid:
                                        </p>
                                        <p style={{
                                            float: "left",
                                            fontSize: "16px",
                                            width: "66%",
                                            textAlign: "left",
                                            height: "12px"
                                        }}>
                                            {auction.highestBid > 0 ? ("$ " + auction.highestBid) : "No Bid"}
                                        </p>
                                    </div>
                                    <div key={"auctionReserve" + auction.auctionId}
                                         style={{height: "30px", verticalAlign: "middle"}}>
                                        <p style={{
                                            float: "left",
                                            fontSize: "16px",
                                            width: "33%",
                                            textAlign: "left",
                                            height: "12px"
                                        }}>
                                            Reserve:
                                        </p>
                                        <p style={{
                                            float: "left",
                                            fontSize: "16px",
                                            width: "35%",
                                            textAlign: "left",
                                            height: "12px"
                                        }}>
                                            $ {auction.reserve}
                                        </p>
                                        {isReserveMet(auction) ?
                                            <p style={{
                                                float: "right",
                                                fontStyle: "italic",
                                                fontSize: "16px",
                                                color: "green",
                                                width: "fit-content",
                                                textAlign: "right",
                                                height: "12px"
                                            }}>
                                                Reserve Met
                                            </p>
                                            :
                                            <p style={{
                                                float: "right", fontStyle: "italic", fontSize: "16px",
                                                color: "red", width: "40%%", textAlign: "right", height: "12px"
                                            }}>
                                                Not Met
                                            </p>
                                        }
                                    </div>
                                    <div key={"auctionCategory" + auction.auctionId}
                                         style={{height: "30px", verticalAlign: "middle"}}>
                                        <p style={{
                                            float: "left",
                                            fontSize: "16px",
                                            width: "33%",
                                            textAlign: "left",
                                            height: "12px"
                                        }}>
                                            Category:
                                        </p>
                                        <p style={{
                                            float: "left",
                                            fontSize: "16px",
                                            width: "66%",
                                            textAlign: "left",
                                            height: "12px"
                                        }}>
                                            {getCategoryName(auction.categoryId, categories)}
                                        </p>

                                    </div>
                                    <div key={"auctionStatus" + auction.auctionId}
                                         style={{height: "30px", verticalAlign: "middle"}}>
                                        <p style={{
                                            float: "left",
                                            fontSize: "16px",
                                            width: "33%",
                                            textAlign: "left",
                                            height: "12px"
                                        }}> Remaining : </p>
                                        <p style={{
                                            float: "left",
                                            fontSize: "16px",
                                            width: "66%",
                                            textAlign: "left",
                                            height: "12px"
                                        }}>
                                            {getRemainingTime(auction.endDate)}
                                        </p>
                                    </div>
                                    <div key={"auctionSeller" + auction.auctionId}
                                         style={{height: "30px", verticalAlign: "middle"}}>
                                        <p style={{
                                            float: "left",
                                            fontSize: "16px",
                                            width: "33%",
                                            height: "50px",
                                            textAlign: "left",
                                            paddingTop: "10px"
                                        }}>
                                            Seller:
                                        </p>
                                        <p style={{
                                            float: "left",
                                            fontSize: "16px",
                                            width: "fit-content",
                                            textAlign: "left",
                                            height: "50px"
                                        }}>
                                            {auction.sellerFirstName}
                                            <br/>
                                            {auction.sellerLastName}
                                        </p>
                                        <p style={{height: "30px", verticalAlign: "middle"}}>
                                            <img
                                                src={"http://localhost:4941/api/v1/users/" + auction.sellerId + "/image"}
                                                onError={getDefaultImageSrc}
                                                alt={"Not Available"}
                                                style={{width: "50px", height: "50px", paddingLeft: "5px"}}
                                            />
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </Paper>
                    </div>
            )
        )
    } else {
        return (
            <h2>
                Loading...
            </h2>
        )
    }
}

export default list_of_auctions;