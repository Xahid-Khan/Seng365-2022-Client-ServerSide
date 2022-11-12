import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Auctions from "./components/Auctions";
import NotFound from "./components/NotFound";
import AuctionDetails from "./components/AuctionDetails";
import UserProfile from "./components/UserProfile";
import MyAuctions from "./components/MyAuctions";
import ListAnAuction from "./components/ListAnAuction";
import EditAuction from "./components/EditAuction";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
              <Route path="*" element={<NotFound/>}/>
              <Route path="/" element={<Auctions/>}/>
              <Route path="/auctions" element={<Auctions/>}/>
              <Route path="/auctions/*" element={<Auctions/>}/>
              <Route path="/auctions/:auctionId" element={<AuctionDetails/>}/>
              {
                localStorage.getItem("token") !== null ?
                    <>
                        <Route path="/myAuctions" element={<MyAuctions/>}/>
                        <Route path="/userProfile" element={<UserProfile/>}/>
                        <Route path="/listAuction" element={<ListAnAuction/>}/>
                        <Route path="/editAuction/:auctionId" element={<EditAuction/>}/>
                    </>
                 :
                    <Route path="/" element={<Auctions/>}/>
              }
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;
