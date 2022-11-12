import React from "react";
import axios from "axios";
import CSS from 'csstype';
import {Button, Paper, TextField} from "@mui/material";
import NavBar from "./NavBar";
import loadingImage from "../images/loading-load.gif";
import useCollapse from "react-collapsed";
import {FilterAlt, FilterAltOff} from "@mui/icons-material";
import list_of_auctions from "../services/list_of_auctions";

const Auctions = () => {
    const [auctions, setAuctions] = React.useState<Array<Auction>>([]);
    const [loadingAuctions, setLoadingAuctions] = React.useState(false);
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [sortAttribute, setSortAttribute] = React.useState<string>("CLOSING_SOON");
    const [sortOrderFilter, setSortOrderFilter] = React.useState<string>("ASC");
    const [pageNumber, setPageNumber] = React.useState(1);
    const [count, setCount] = React.useState(10);
    const [startIndex, setStartIndex] = React.useState(0);
    const [totalAuctions, setTotalAuctions] = React.useState(0);
    const [keyWord, setKeyword] = React.useState<string>("");
    const [categoryFilter, setCategoryFilter] = React.useState("");
    const [categoryFilterArray, setCategoryFilterArray] = React.useState<Array<string>>([]);
    const [auctionStatus, setAuctionStatus] = React.useState("");
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
    const queryArray = window.location.search.substring(1).split("&");
    let filterQuery = ""

    const sortingValues = [
        {
            "label": "Closing Date",
            "value": "CLOSING_SOON"
        },
        {
            "label": "Alphabetical",
            "value": "ALPHABETICAL"
        },
        {
            "label": "Reserve",
            "value": "RESERVE"
        },
        {
            "label": "Bid",
            "value": "BIDS"
        }
    ]

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        marginTop: "0px",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "center",
    }

    const auctionCard: CSS.Properties = {
        padding: "5px",
        margin:"20px",
        width:"300px",
        height:"525px",
        float:"left",

    }

    function urlGeneration () {
        const stringifyCategoryFilter = () => {
            let result = [];
            let i = 0;
            while (categoryFilterArray.length > i) {
                result.push( "categoryIds=" + categoryFilterArray[i]);
                i++;
            }
            return result.join("&")
        }

        let buildFilterQuery = [];
        if (keyWord !== "") {buildFilterQuery.push("q="+keyWord);} else {setKeyword("")}
        if (categoryFilterArray.length > 0) buildFilterQuery.push(stringifyCategoryFilter()) ;
        if (auctionStatus !== "") buildFilterQuery.push("status="+auctionStatus);
        if (sortAttribute !== "") buildFilterQuery.push(
            sortAttribute === "CLOSING_SOON" ?
                sortOrderFilter === "ASC" ?
                    "sortBy=" + sortAttribute
                    :
                    "sortBy=" + "CLOSING_LAST"
                :
            "sortBy="+sortAttribute + "_" + sortOrderFilter
        );

        filterQuery = (buildFilterQuery.length > 0 ? (
                                (queryArray.length > 0 ? "&" : "") + buildFilterQuery.join("&")
                            ) : "")
    }

    React.useEffect(
        () => {
            getAuctions()
        }, [auctionStatus, sortAttribute, keyWord, sortOrderFilter, pageNumber, count, totalAuctions, categoryFilter]
    )

    function getCategories () {
        axios.get("http://localhost:4941/api/v1/auctions/categories")
            .then((response) => {
                if (sortAttribute === "CLOSING_SOON") {
                    setCategories(response.data.sort((itemA:Auction, itemB:Auction) => {return  itemA.endDate < itemB.endDate}));
                }
                setCategories(response.data);
            }, (error) => {
                console.log(error.response.data);
            }
        )
    }

    const getAuctions = () => {
        urlGeneration();
        axios.get("http://localhost:4941/api/v1/auctions?count="+ count + "&startIndex=" + startIndex + filterQuery + "&" + queryArray)
            .then((response) => {
                setLoadingAuctions(true)
                setTotalAuctions(response.data.count)
                setAuctions(response.data.auctions)
                getCategories();
            }, (error) => {
                console.log(error.response.data);
            })
    }

    const keyWordHandler = (event: any) => {
        setKeyword(event.target.value);
    }

    const categoryFilterHandler = (event: any) => {
        if (event.target.value !== "") {
            setCategoryFilter(event.target.value);
            let newArray = [event.target.value]
            categoryFilterArray.forEach(item => newArray.push(item));
            setCategoryFilterArray(newArray);
        } else {
            setCategoryFilter("");
            setCategoryFilterArray([]);
        }
    }

    const statusFilterHandler = (event: any) => {
        setAuctionStatus(event.target.value);
    }

    const sortingFilterHandler = (event: any) => {
        setSortAttribute(event.target.value);
    }

    const sortingOrderHandler = (event: any) => {
        setSortOrderFilter(event.target.value);
    }

    const handlePrevPage = () => {
        if (pageNumber > 1) {
            window.scrollTo({top: 0, left: 0, behavior: 'auto'});
            setStartIndex(startIndex - count);
            setPageNumber(pageNumber - 1);
        }
    }

    const handleNextPage = () => {
        if (pageNumber <= (totalAuctions / count)) {
            window.scrollTo({top: 0, left: 0, behavior: 'auto'});
            setStartIndex(startIndex + count);
            setPageNumber(pageNumber + 1);
        }
    }

    function SearchAndFilter () {
        return (
            <div key={"collapsibleParams"} className="collapsible">
                <div key={"searchFilterHeader"} className="header" {...getToggleProps()}>
                    {isExpanded ?
                        <Button variant={"outlined"} style={{float:"right"}} endIcon={<FilterAlt/>}>Close Filter</Button>
                        :
                        <Button variant={"contained"} style={{float:"right"}} endIcon={<FilterAltOff/>}>Filter Auctions</Button>
                    }
                </div>
                <div key={"searchFilterBody"} style={{width:"80%"}}>
                    <div key={"searchFilterProps"} {...getCollapseProps()} >
                        <div key={"searchFilterContent"} className="content">
                            <table key={"filterParamsTable"} style={{width:"90%", display:"table"}}>
                                <tbody key={"filterParamsTableBody"}>
                                    <tr key={"filterAlphaRow"} style={{padding:"2px", width:"100%"}}>
                                        <td key={"paramKeywordLabel"} style={{width:"50%", textAlign:"right"}}>
                                            <label style={{paddingTop:"1px", height:"25px"}}>Keyword: </label>
                                        </td>
                                        <td key={"paramkeywordInput"} style={{width:"275px", textAlign:"start", marginBottom:"7px"}}>
                                            <TextField variant="standard" style={{height:"20px", padding:"0px", margin:"0px", marginBottom:"20px"}}
                                                       defaultValue="" onChange={keyWordHandler}/>
                                        </td>
                                    </tr>
                                    <tr key={"filterCategoryRow"} style={{padding:"2px", width:"100%"}}>
                                        <td key={"paramCategoryLabel"} style={{width:"50%", textAlign:"right"}}>
                                            <label style={{paddingTop:"0px", height:"25px"}}>Category: </label>
                                        </td>
                                        <td key={"paramCategoryInput"} style={{width:"275px", textAlign:"start", marginBottom:"7px"}}>
                                            <select style={{width:"225px"}} onChange={categoryFilterHandler}>
                                                <option value={""}>Any</option>
                                                {categories.sort(
                                                    (a, b) => a.name > b.name ? 1 : -1
                                                ).map(item => <option value={item.categoryId.toString()}>{item.name}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr key={"filteredCategoryList"} style={{padding:"2px", width:"100%"}}>
                                        <td key={"filteredCategoryListLabel"} style={{width:"50%", textAlign:"right"}}>
                                            <label style={{paddingTop:"0px", height:"25px"}}>Categories Selected: </label>
                                        </td>
                                        <td key={"categoryListShow"}  style={{width:"275px", textAlign:"start", marginBottom:"7px"}}>
                                            {categories.filter(category => categoryFilterArray.includes(""+category.categoryId)).map(category => category.name).join(", ")}
                                        </td>
                                    </tr>
                                    <tr key={"filterStatusRow"} style={{padding:"2px", width:"100%"}}>
                                        <td key={"paramStatusLabel"}  style={{width:"50%", textAlign:"right"}}>
                                            <label style={{paddingTop:"1px", height:"25px"}}>Status: </label>
                                        </td>
                                        <td key={"paramStatusInput"} style={{width:"275px", textAlign:"start", marginBottom:"7px"}}>
                                            <select style={{width:"225px"}} onChange={statusFilterHandler}>
                                                <option value={"ANY"}>{"Any"}</option>)
                                                <option value={"OPEN"}>{"Open"}</option>)
                                                <option value={"CLOSED"}>{"Closed"}</option>)
                                            </select>
                                        </td>
                                    </tr>
                                    <tr key={"filterSortRow"} style={{padding:"2px", width:"100%"}}>
                                        <td key={"paramSortLabel"} style={{width:"50%", textAlign:"right"}}>
                                            <label style={{paddingTop:"1px", height:"25px"}}>Sort By: </label>
                                        </td>
                                        <td key={"paramSortInput"} style={{width:"275px", textAlign:"start", marginBottom:"7px"}}>
                                            <select style={{width:"175px"}} onChange={sortingFilterHandler}>
                                                {sortingValues.map(item => <option value={item.value}>{item.label}</option>)}
                                            </select>
                                            <select style={{width:"80px"}} onChange={sortingOrderHandler}>
                                                <option value={"ASC"}>ASC</option>
                                                <option value={"DESC"}>DESC</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr key={"filterParamsRow"} style={{padding:"2px", width:"100%"}}>
                                        <td key={"clearFilterButton"} style={{width:"50%", textAlign:"right"}}>
                                            <Button variant={"text"} type="submit" value="Search" onClick={()=> window.location.reload()}>
                                                Clear Filter
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div key={"body"}>
            {<NavBar/>}
            <Paper elevation={4} style={card} key={"BaseForAuctions"}>
                <div key={"divToShowSearchNFilters"} style={{width:"100%"}}>
                    {SearchAndFilter()}
                </div>
                {!loadingAuctions ?  <h1><br/><br/> <img src={loadingImage}/> <br/><br/></h1>
                    :
                    auctions.length > 0 ? list_of_auctions(auctions, categories) : <h1><br/><br/> No Auctions Found... <br/><br/></h1>}
                <br/>
            </Paper>
            <div style={{width:"100%", display:"flex", justifyContent:"center"}} key={"paginationDiv"}>
                <div key={"divToShowPaginationButtons"} style={{width:"400px", display:"flex", justifyContent:"center"}}>
                    <Button variant={"contained"} style={{margin:"0px 20px 0px 20px"}} onClick={handlePrevPage} disabled={
                        !(pageNumber > 1 && totalAuctions > count)
                    } >prev</Button>
                    <div >Page {pageNumber} </div>
                    <Button variant={"contained"} style={{margin:"0px 20px 0px 20px"}} onClick={handleNextPage} disabled={
                        !(pageNumber < (totalAuctions / count) && totalAuctions > count)
                    } >next</Button>
                </div>
            </div>
        </div>
    )
}

export default Auctions;