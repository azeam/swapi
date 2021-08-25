import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export const MovieModal = (props) => {
    const {isOpen, toggleModal, movieTitle, movieCharacters} = props;
    const [characters, setCharacters] = useState([]);
    const [charactersCount, setCharactersCount] = useState();
    const [content, setContent] = useState([]);
    
    useEffect(() => {
        if (!isOpen) {
            setCharacters([]);
            return;
        }
        setCharactersCount(movieCharacters.length);
        setContent("Loading characters...");
        movieCharacters.map(char => (
            fetch(`${char}`)
            .then(res => res.json())
            .then(
                (result) => {
                    setCharacters(characters => [...characters, result.name]);   
                },
                (error) => {
                    setContent(error);
                }
            )
        ))
    }, [isOpen, movieCharacters])

    useEffect(() => {
        if (characters.length === charactersCount) {
            setContent(characters.sort());
        }
    }, [characters, charactersCount]);

    if (!movieCharacters) {
        return null;
    }
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={toggleModal}
        >
            <>
                <h2>{movieTitle}</h2>
                {Array.isArray(content) ? content.map((char) => {
                    return (<li key={char}>{char}</li>)
                }) : content}
            </>
            <br />
            <button onClick={toggleModal}>Close modal</button>
        </Modal>
    )
}
