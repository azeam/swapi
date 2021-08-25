import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export const MovieModal = (props) => {
    const {isOpen, toggleModal, movieTitle, content} = props;
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={toggleModal}
        >
            <>
                <h2>{movieTitle}</h2>
                {Array.isArray(content) ? content.map((char) => {
                    return (<div key={char}>{char}</div>)
                }) : content}
            </>
            <br />
            <button onClick={toggleModal}>Close character list</button>
        </Modal>
    )
}
