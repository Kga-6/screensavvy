import React, {useState} from "react"

// Styles
import "./Header.css"
import "../../styles/button.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

// contexts
import { useAppContext } from "../../contexts/AppContext"

// data
import tags from '../../data/tags.json'

const Tag = (props) => {

  const Style = `tag ${props.selected&&"tag-selected"}`

  return(
    <button onClick={()=>{props.handleTag(props.name)}}  className={Style}>

      {props.selected&&
        <FontAwesomeIcon icon={faCircleXmark} size="lg" />
      }
      {props.name}
    </button>
  )
}

const Filter = () => {

  const {select,setSelect,filter,setFilter} = useAppContext()
  
  const handleChange = (e) => {
    e.preventDefault()
    setSelect(e.target.value)
  }

  const handleTag = (tag) => {
    if(!filter.includes(tag)){
      setFilter((prev)=>[...prev,tag])
    }else{
      const newFilter = filter.filter((value) => value !== tag);
      setFilter(newFilter);
    }
  }
  
  const sortedTags = () => {
    const newTags = []
    tags.map((tag)=>{
      if(filter.includes(tag)){
        newTags.unshift(tag)
      }else{
        newTags.push(tag)
      }
    })
    return newTags
  }

  return(
    <div className="filters">
      <div className="filter-left-content">
        <select className="filter-select" id="type-select" value={select} onChange={handleChange}>
          <option value="top10">Top 10</option>
          <option value="mw">Most Watched</option>
        </select>
      </div>
      <span className="filter-split">|</span>
      <div className="filter-right-content">
        <div className="filter-tags">
          {
            sortedTags().map((tag,index)=>{
              return <Tag handleTag={handleTag} selected={filter.includes(tag)?true:false} key={index} name={tag}></Tag>
            })
          }
        </div>
      </div>
    </div>
  )
}

const Header = () => {
  return(
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="header-logo-container">
              <h1 className="header-logo-title">ScreenSavvu</h1>
            </div>
            {/* <div className="header-right-content">
              <button className="">MY FAVORITES</button>
            </div> */}
          </div>
        </div>
      </header>

      {/* <Filter/> */}
    </>
  )
}

export default Header