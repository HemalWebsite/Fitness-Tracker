import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ExerciseDetailsPopup = ({ show, handleClose, exercise }) => {
  const youtubeLink = exercise.videoUrl || '#';

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{exercise.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={exercise.gifUrl} alt={exercise.name} className="img-fluid mb-3" />
        <p><strong>Body Part:</strong> {exercise.bodyPart}</p>
        <p><strong>Target Muscle:</strong> {exercise.target}</p>
        <p><strong>Equipment:</strong> {exercise.equipment}</p>
        <p><strong>Description:</strong> {exercise.description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          style={{ backgroundColor: '#ff8c00', borderColor: '#ff8c00' }}
          onClick={() => window.open(youtubeLink, '_blank')}
        >
          Watch on YouTube
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExerciseDetailsPopup;
