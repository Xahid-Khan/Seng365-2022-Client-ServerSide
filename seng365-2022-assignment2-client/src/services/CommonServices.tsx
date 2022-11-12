import React from "react";
import auctionImage from "../images/auction.png";

const getCategoryName = (categoryId: Number, categories: Category[]) => {
    if (categories.length > 0) {
        let result : Category[] = categories.filter((category: Category) => category.categoryId === categoryId);
        return (
            result[0].name
        );
    }
}

const getRemainingTime = (endDate: string) => {
    const utcDate = getEndDateToLocalTime(endDate)

    const auctionEndDate = new Date(utcDate).getTime()
    const currentDate = new Date().getTime()

    const days = Math.ceil((auctionEndDate - currentDate) / (86400 * 1000));

    let time = new Date(utcDate).getTime() - new Date().getTime();

    return (
        days > 1 ? <p style={{float:"none", color:"orange"}}>{days} days</p>
            :
            time > 0? <p style={{color:"red", float:"none"}}>Closing at {new Date(utcDate).toLocaleTimeString("en-US", {
                                                                                                        hour12: true})} </p> : "Closed"
    )
}

const getDefaultImageSrc = (event: any) => {
    event.target.src = "https://humanimals.co.nz/wp-content/uploads/2019/11/blank-profile-picture-973460_640.png";
}

const getDefaultAuctionImageSrc = (event: any) => {
    event.target.src = {auctionImage};
}

const isReserveMet = (auction: Auction) => {
    return auction.highestBid >= auction.reserve;
}

const getMinDateForAuctions = () => {
    let today = new Date();
    today.setDate(today.getDate() + 1)
    return today
}

const getEndDateToLocalTime = (endDate: string) => {
    const userOffset = new Date().getTimezoneOffset()*60*1000;
    const localDate = new Date(endDate);
    const utcDate = new Date(localDate.getTime() - userOffset);
    return utcDate.toLocaleString();
}

export {
    getCategoryName,
    getRemainingTime,
    getDefaultImageSrc,
    getDefaultAuctionImageSrc,
    isReserveMet,
    getMinDateForAuctions,
    getEndDateToLocalTime,
};
