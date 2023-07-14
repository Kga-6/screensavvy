import React, { useState } from "react";

// styles 
import "./Control.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronDown } from '@fortawesome/free-solid-svg-icons'

// contexts
import { useAppContext } from "../../contexts/AppContext"

const sorts = {
  "Top Rated": "top_rated",
  "Now Playing": "now_playing",
  "Popular":"popular"
}

const sorts_tv = {
  "Top Rated": "top_rated",
  "On The Air": "on_the_air",
  "Airing Today": "airing_today",
  "Popular":"popular"
}


const Filter = () => {
  return(
    <div className="control-action-container">
      <button className="filter control-action">
        <span className="control-action-title">Filter</span>
        <FontAwesomeIcon className="control-action-icon" icon={faChevronDown} size="sm" beat/>
      </button>
    </div>
  )
}

const Watch = () => {
  return(
    <div className="control-action-container">
      <button className="watch control-action">
        <span className="control-action-title">Where To Watch</span>
        <FontAwesomeIcon className="control-action-icon" icon={faChevronDown} size="sm" beat/>
      </button>
    </div>
  )
}

const Sort = () => {

  const {setSort,sort,type} = useAppContext()
  const [show,setShow] = useState(false)

  const handleShow = () => {
    setShow(!show)
  }

  const handleChange = (e) => {
    setSort(e.target.value)
    console.log(e.target.value)
  }

  return(
    <div className="control-action-container">
      <button onClick={handleShow} className="sort control-action">
        <span className="control-action-title">Sort</span>
        <FontAwesomeIcon className="control-action-icon" rotation={show==true?180:0} icon={faChevronDown} size="sm" beat/>
      </button>
      {
        show&&
        <div className="control-action-menu sort-menu">
          <label className="control-action-menu-title" htmlFor="sort">Sort Results By</label>
          <select onChange={handleChange} className="control-sort-select" name="sort" id="sort">
            {
              Object.entries(type=="movie"?sorts:sorts_tv).map(([value,key])=>{
                return <option key={value} value={key}>{value}</option >
              })
              // sorts.map((sort)=>{
              //   return <option key={sort} value={sort}>{sort}</option >
              // })
            }
          </select>
        </div>
      }
    </div>
  )
}

const Personal = () => {
  return(
    <>
      <h1 className="control-h1">Profile</h1>
      <div className="personal control-action-container">
        <button className="me control-action">
          <span className="control-action-title">Me</span>
          <FontAwesomeIcon className="control-action-icon" icon={faChevronDown} size="sm" beat/>
        </button>
      </div>
    </>
  )
}

const Control = ({refState}) => {

  const {type,setType,handleSearch,fetching,enable,setSort} = useAppContext()

  const handleType = (value) => {
    setType(value)
    setSort("top_rated") // default the sort value
  }

  const handleStyles = (target) => {
    let style = ""
    switch(target){
      case "movieBtn":
        style = `control-btn control-movie-btn ${type=="movie"&&"control-btn-selected"}`
        break
      case "tvBtn":
        style = `control-btn control-tv-btn ${type=="tv"&&"control-btn-selected"}`
        break
      case "searchBtn":
        style = `control-search ${enable===false&&"control-search-disable"}`
        break
      default:
        style = ""
    }
    return style
  }

  return(
    <div ref={refState} className="control">
      <header className="control-header">
        <button className={handleStyles("movieBtn")}  onClick={()=>{handleType("movie")}}>Movies</button>
        <button className={handleStyles("tvBtn")} onClick={()=>{handleType("tv")}}>Tv Shows</button>
      </header>
      <div className="control-actions">
        <Sort></Sort>
        <Watch></Watch>
        <Filter></Filter>
      </div>
      <button className={handleStyles("searchBtn")} onClick={()=>{handleSearch()}}>{fetching?"Loading...":"Search"}</button>
    </div>
  )
}

export default Control