import React, { useState, useEffect } from 'react';
import { MovieModal } from "./MovieModal";


export const Movies = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [movies, setMovies] = useState([]);
    const [movieTitle, setMovieTitle] = useState();
    const [movieCharacters, setMovieCharacters] = useState();
    const [isOpen, setIsOpen] = useState(false);

    function toggleModal(movie) {
        setIsOpen(!isOpen);
        setMovieTitle(movie.title);
        setMovieCharacters(movie.characters);
    }

    const sortDescending = (movies) => {
        movies.sort((a, b) => {
            let date1 = new Date(a.release_date).getTime();
            let date2 = new Date(b.release_date).getTime();
            return date2 - date1;
        });
        return movies;
    }

    useEffect(() => {
        fetch("https://swapi.dev/api/films")
        .then(res => res.json())
        .then(
            (result) => {
                result = sortDescending(result.results);
                setIsLoaded(true);
                setMovies(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading Star Wars movies...</div>;
    } else {
        return (
        <>
        <ul>
            {movies.map(movie => (
                <li key={movie.episode_id}>
                    <button onClick={() => toggleModal(movie)}>{movie.title} - {movie.release_date}</button>
                </li>
            ))}
        </ul>
        <MovieModal 
            isOpen={isOpen} 
            toggleModal={toggleModal}
            movieTitle={movieTitle}
            movieCharacters={movieCharacters}
        />
        </>
        );
    }
}