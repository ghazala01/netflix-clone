import React, { useState, useEffect } from 'react';
import './Row.css';
import Youtube from 'react-youtube';
import axios from './axios';

const baseUrl = 'https://image.tmdb.org/t/p/original';
function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');
  //code which runs based on specific condition
  useEffect(() => {
    //if [] then run only once when the row loads
    //if [variable] then run when row loads and run when variable value changes
    async function fetchData() {
      //axios gives instance and remaining from prop fetchUrl passed from Row
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
    //eternal variable in useEffect must be put in like [fetchUrl] as it
    //is dependency in this way useEffect refires the code when fetchUrl
    //changes
  }, [fetchUrl]);

  const opts = {
    height: '390',
    width: '99%',
    playerVars: {
    autoplay: 1,
    },
  };

  const handleClick = async (movie) => {
    if (trailerUrl) {
      //if already open then close it
      setTrailerUrl('');
    } else {
		let trailerurl = await axios.get(
			`/movie/${movie.id}/videos?api_key=fb34530271b349314af0de263d16ab5a`
		  );
		  setTrailerUrl(trailerurl.data.results[0]?.key);
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map((movie) => (
          <img
            onClick={() => handleClick(movie)}
            key={movie.id}
            className={`row_poster ${isLargeRow && 'row_posterLarge'} `}
            src={`${baseUrl}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;