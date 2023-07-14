import axios from "axios"

const region = "US"
const lang = "en-US"
const options = {
  headers: {
    accept: 'application/json',
    Authorization: process.env.REACT_APP_TMADB
  }
};

export async function get_trailer(id,type){

  try{
    const response = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/videos`,options)
    let trailer = null

    response.data.results.map((value)=>{
      if(value.type == "Trailer"){
        trailer = value
      }
    })

    return trailer
    
  } catch(error){
  console.log(error)
  }

}

export async function savvu_system(type,sort){

  // return axios.get(`https://api.themoviedb.org/3/${type}/${sort}?language=en-US&page=1`, options)
  //   .then(response => response.data)
  //   .catch(error => console.error(error));

  try{
    const response = await axios.get(`https://api.themoviedb.org/3/${type}/${sort}?language=en-US&page=1`, options)
    
    const promises = response.data.results.map(async(value)=>{
      const platformsPromise = axios.get(`https://api.themoviedb.org/3/${type}/${value.id}/watch/providers`, options);
      //const imagesPromise = axios.get(`https://api.themoviedb.org/3/${type}/${value.id}/images`, options);
      const creditsPromise = axios.get(`https://api.themoviedb.org/3/${type}/${value.id}/credits`, options);
      const detailsPromise = axios.get(`https://api.themoviedb.org/3/${type}/${value.id}`, options);

      const [platformsResponse, creditsResponse, detailsResponse] = await Promise.all([platformsPromise,creditsPromise,detailsPromise]);
      value.platforms = platformsResponse.data.results.US;
      //value.imagesData = imagesResponse.data;
      value.credits = creditsResponse.data
      value.details = detailsResponse.data

      return value;
    })

    const resolvedTitles = await Promise.all(promises);
    response.data.results = resolvedTitles;

    console.log(response.data)

    return response.data;
  } catch(error){
    console.error(error)
    return [];
  }

}

export function savvu_top_10() {

  return axios.get('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    .then(response => response.data)
    .catch(error => console.error(error));
    
}
