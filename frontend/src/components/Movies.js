import React, { useState, useEffect } from 'react';
import { MovieModal } from "./MovieModal";
import '../css/style.css';

export const Movies = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [movies, setMovies] = useState([]);
    const [movieTitle, setMovieTitle] = useState();
    const [characterUrls, setCharacterUrls] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [characters, setCharacters] = useState([]);
    const [content, setContent] = useState();
    const mainUrl = "https://swapi.dev/api/films";
    
    // reset states when changing modals
    function toggleModal(movie) {
        setMovieTitle(movie.title);
        setCharacterUrls(movie.characters);
        setCharacters([]);
        setContent("Loading characters...");
        setIsOpen(!isOpen);
    }

    const sortDescending = (movies) => {
        movies.sort((a, b) => {
            let date1 = new Date(a.release_date).getTime();
            let date2 = new Date(b.release_date).getTime();
            return date2 - date1;
        });
        return movies;
    }

    // fetch movies list on first render and save to LS (if not present)
    useEffect(() => {
        let data = localStorage.getItem("moviesList");
        if (data) {
            setIsLoaded(true);
            setMovies(JSON.parse(data));
        }
        else {
            fetch(mainUrl)
            .then(res => res.json())
            .then(
                (result) => {
                    result = sortDescending(result.results);
                    setIsLoaded(true);
                    setMovies(result);
                    localStorage.setItem("moviesList", JSON.stringify(result)); 
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }
    }, [])
    
    // fetch characters list when opening modal
    useEffect(() => {
        if (!isOpen) {
            return;
        }
        let data = localStorage.getItem(movieTitle);
        if (data) {
            setContent(JSON.parse(data));
        }  
        else {
            characterUrls.map(url => (
                fetch(`${url}`)
                .then(res => res.json())
                .then(
                    (result) => { setCharacters(characters => [...characters, result.name]); },
                    (error) => { setContent(error.message); }
                )
            ))
        }
    }, [isOpen, characterUrls, movieTitle])

    // save characters list to LS and update state after loading all
    useEffect(() => {
        if (characterUrls && characters.length === characterUrls.length) {
            setContent(characters.sort());
            localStorage.setItem(movieTitle, JSON.stringify(characters.sort()));
        }        
    }, [characters, characterUrls, movieTitle]);

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
                        <button className="link-button" onClick={() => toggleModal(movie)}>
                            {movie.title} - {movie.release_date}
                        </button>
                    </li>
                ))}
            </ul>
            <MovieModal 
                isOpen={isOpen} 
                toggleModal={toggleModal}
                movieTitle={movieTitle}
                content={content}
            />
        </>
        );
    }
}
