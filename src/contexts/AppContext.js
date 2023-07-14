import React, {createContext,useContext, useEffect, useState} from "react";
import { savvu_top_10, savvu_system } from "../events/demo";

// context
const AppContext = createContext(null)

export function AppProvider({children}){

  // const [select,setSelect] = useState("top10")
  // const [filter, setFilter] = useState([]);

  const [titles,setTitles] = useState([])
  const [type,setType] = useState("movie") // [movie,tv]
  const [sort,setSort] = useState("top_rated")
  const [fetching,setFetching] = useState(false)
  const [enable,setEnable] = useState(true)

  // search for titles based on states
  const handleSearch = () => {
    if(fetching==true) return;
    if(enable==false) return;
    if(type==undefined) return;
    if(sort==undefined) return;

    console.log("Updating titles...")

    setFetching(true)

    async function fetch(){
      const newTest = await savvu_system(type,sort)
      const newTitles = []

      if(newTest == undefined){
        console.log("Something went wrong while fetching for newTitles")
        return
      };

      console.log(newTest)

      if(newTest.results){
        for(let i=0;i<10;i++){
          if(newTest.results[i]){
            newTitles.push(newTest.results[i])
          }else{
            newTitles.push(newTest.results[i++])
          }
        }
        setTitles(newTitles)
      }

      setFetching(false)
      setEnable(false)

    }

    fetch()
  }

  // set the first set of titles on start
  useEffect(()=>{
    handleSearch()
  },[])

  // enable search button when settings changes
  useEffect(()=>{
    setEnable(true)
  },[type,sort])

  return(
    <AppContext.Provider 
      value={{

        // States
        titles,
        fetching,
        type,
        enable,
        setType,
        sort,
        setSort,

        // Functions
        handleSearch

      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(){
  return useContext(AppContext)
}