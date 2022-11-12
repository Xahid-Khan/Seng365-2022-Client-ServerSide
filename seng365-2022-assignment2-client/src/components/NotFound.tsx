import NavBar from "./NavBar";
import {Paper} from "@mui/material";
import React from "react";
import CSS from "csstype";

const NotFound = () => {
    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        marginTop: "0px",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "space-around",
    }

    return (
        <div>
            {<NavBar/>}
            <Paper elevation={4} style={card}>
                <h1>
                    Not Found
                </h1>
            </Paper>
        </div>
    );
}

export default NotFound;