import React, { useState, useEffect } from 'react'
import axios from './axios';
import './Row.css';
import Youtube from 'react-youtube';
import movieTrailer from 'movie-trailer';
const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  //snippet of code that runs based on specific condition/variable
  //every time a row loads, this code will run. useEffect accomplishes that
  //if [] is left blank, code runs only once
  //if there is something in the brackets like [movies], code will run once and then also every time that movies changes
  //that code in the [] is called a dependency, the useEffect code is dependant on it as to whether it will run again
  useEffect(() => {
    //use async function if it's going to take a little time for fetch to complete
    async function fetchData(){
      //await means that the the function will wait to run until the information is received
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
    //if a variable if being pulled in from outside you must include it in the [] because the block dependant on that variable
  }, [fetchUrl])

  const opts = {
    height:"390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    }
  }

  const handleClick = (movie) => {
    // if video is already open, set trailerUrl to be empty
    if (trailerUrl) {
      setTrailerUrl('');
    } else {
      movieTrailer(movie?.name || "")
      .then(url => {
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get('v'));
      }).catch((error) => console.log(error))
    }
  }

  return (
    <div className="row">
      {/* title */}
      <h2 className="row__title">{title}</h2>
      <div className="row__posters">
        {/* several row__posters */}
        {movies.map(movie => (
          <img 
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`} 
            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} 
            alt={movie.name} 
          />
        ))}
      </div>
      <div className="row__video">
      {/* this line is saying "when we have a trailer url then show the youtube video" */}
        {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  )
}

export default Row
