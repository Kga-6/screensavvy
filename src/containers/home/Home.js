import React, {useContext, useEffect, useRef, useState} from "react";
import {get_trailer} from "../../events/demo"
import ReactPlayer from 'react-player/youtube'

// Styles
import "./Home.css"
import "../../styles/swiper.css"
import "../../styles/manswiper.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart,faEye,faBars } from '@fortawesome/free-solid-svg-icons'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// components
import { Pagination,Mousewheel,Navigation  } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Control } from "../../components";

// contexts
import { useAppContext } from "../../contexts/AppContext"

// data
import titles from '../../data/titles.json'

const Actors = ({credits}) => {
  console.log(credits)
  return(
    <div className="swiper-nav-actors">
      <Swiper
        slidesPerView={5}
        centeredSlides={false}
        spaceBetween={10}
        loop={false}
        navigation={false}
        modules={[Pagination,Navigation]}
        className="manswiper"
      >
       {
        credits.cast.map((value,index)=>{
          return(
            <SwiperSlide className="actor-manswiper-container" key={value.id}>
              <div className="actor-content">
                <img className="actor-profile-image" src={`https://image.tmdb.org/t/p/original/${value.profile_path}`}></img>
                <label className="actor-name">{value.name}</label>
              </div>
            </SwiperSlide>
          )
        })
       }
      </Swiper>
      {/* {
        credits.cast.map((value,index)=>{
          return <div key={value.id}>{`${value.name} [${value.known_for_department}]`}</div>
        })
      } */}
    </div>
  )
}

const Platforms = ({platforms}) => {
  const [state,setState] = useState([])

  useEffect(()=>{
    if(platforms){
      if(platforms.buy){
        setState((prevPlatforms) => [...platforms.buy]);
      }
      if(platforms.rent){
        setState((prevPlatforms) => [...platforms.rent]);
      }
    }
  },[platforms])

  return(
    <div className="swiper-nav-platforms">
      {
        state.map((value,index)=>{
          return (
            <div className="swiper-nav-platform" key={index}>
              <img 
                className="platform-icon" 
                src={`https://image.tmdb.org/t/p/original/${value.logo_path}`} 
                alt={value.provider_name}
              ></img>
            </div>
          )
        })
      }
    </div>
  )
}

const SlideContent = ({data,index,handleTrailerCall}) => {

  const {type} = useAppContext()
  const [nav,setNav] = useState(data.platforms?"platforms":"actors") // platforms,actors
  const [info,setInfo] = useState("sad")

  useEffect(()=>{
    const releaseDate = data.details.release_date
    const genres = data.details.genres.map(genre => ` ${genre.name}`)
    const runtime = data.details.runtime

    // lets convert the runtime to hours, minutes
    const hours = Math.floor(runtime / 60); // 1 hour
    const minutes = runtime % 60; // 54 minutes

    setInfo(`${releaseDate}(US) - ${genres} - ${hours}h ${minutes}m`)
  },[data])

  const handleNav = (value) =>{
    setNav(value)
  }

  const handleTrailer = async (id,type) =>{
    console.log(data)
    const trailer = await get_trailer(id,type)
    console.log(trailer)
    handleTrailerCall(trailer.key)
  }

  return(
    <div className="swiper-content">
      <div className="swiper-shadow"></div>
      <div className="swiper-number">#{index}</div>

      <div className="swiper-info">
        <h1 className="swiper-title">{data.title || data.name}</h1>
        <p className="swiper-data">{info}</p>
        <p className="swiper-desc">
          {data.overview}
        </p>
      </div>


      <div className="swiper-nav">
        <header className="swiper-nav-header">
          {data.platforms&&
            <button className="swiper-nav-btn" onClick={()=>{handleNav("platforms")}}>Platforms</button>
          }
          {data.credits&&
            <button className="swiper-nav-btn" onClick={()=>{handleNav("actors")}}>Actors</button>
          }
        </header>
        <div className="swiper-nav-content">
          {nav=="platforms"?<Platforms platforms={data.platforms}></Platforms>:<Actors credits={data.credits}></Actors>}
        </div>
      </div>

      <div className="swiper-actions">
        <button onClick={()=>{handleTrailer(data.id,type)}} className="button-style-base">Trailer</button>
        <button className="button-style-base">
          <FontAwesomeIcon icon={faHeart} size="lg"/>
        </button>
        <button className="button-style-base">
          <FontAwesomeIcon icon={faEye} size="lg" />
        </button>
      </div>
      <img className="swiper-cover" src={`https://image.tmdb.org/t/p/w500${data.backdrop_path}`}></img>
    </div>
  )
}

const Trailer = ({url,handleView}) => {
  return(
    <div className="trailer">
      <div className="trailer-content">
        <button onClick={handleView} className="trailter-close">X</button>
        <div className="trailer-video">
          <ReactPlayer
            className='react-player'
            url={`https://www.youtube.com/watch?v=${url}`}
            playing={true}
            controls={true}
            width='100%'
            height='100%'
          />
        </div>
      </div>
    </div>
  )
}

const Home = () => {

  const {titles,fetching} = useAppContext()
  const [show,setShow] = useState(false)
  const menuRef = useRef(null)

  const player = useRef(null)
  const [trailer,setTrailer] = useState()
  const [view,setView] = useState(true)
 
  const handleMenu = () => {
    console.log(menuRef)
    if(menuRef.current){
      if(show == false){
        menuRef.current.setAttribute("data-show",true)
        setShow(true)
      }else{
        menuRef.current.removeAttribute("data-show")
        setShow(false)
      }
    }
  }

  const handleView = () => {
    setView(!view)
  }

  const handleTrailerCall = (key) => {
    console.log(key)
    setTrailer(key)
    setView(true)
  }

  return(
    <>
      {
        view&&<Trailer url={trailer} handleView={handleView}/>
      }
      <div className="home">
        <div className="home-content">
          {/* <div className="home-left-content">
            <h1 className="select-title">{titles[select].title}</h1>
            <p dangerouslySetInnerHTML={{ __html: titles[select].describe }} className="select-info"></p>
          </div> */}
          <button onClick={()=>{handleMenu()}} className="menu-btn">
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
          <Control refState={menuRef}></Control>
          <div className="home-right-content">
            {
              fetching?
                <span>Loading</span>
                :
                <div className="swiper-container">
                  <Swiper
                    direction={'vertical'}
                    mousewheel={true}
                  
                    pagination={{
                      clickable: true,
                    }}
                    modules={[Pagination,Mousewheel]}
                    className="mySwiper"
                  >
                    {
                      titles.map((title,index)=>{
                        return(
                          <SwiperSlide key={title.id} className={`${title.title} swiper-titles`}>
                            <SlideContent index={index+=1} data={title} handleTrailerCall={handleTrailerCall}></SlideContent>
                          </SwiperSlide>
                        )
                      })
                    }
                  </Swiper>
                </div>
            }
          </div>
        </div>
      </div>
    </>
    
  )
}

export default Home