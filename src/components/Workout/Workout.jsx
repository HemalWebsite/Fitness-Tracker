


import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import ExerciseDetailsPopup from './ExerciseDetailsPopup';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { margin } from '@mui/system';
import styles from './Workout.module.css';
function Workout() {

  const [messages, setMessages] = useState([]);
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
  

    setMessages(prev => [...prev, { type: 'user', text: userInput }]);
  
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY`,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: userInput 
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );


      
      console.log('API Response:', response.data);
      const aiResponse = response.data.candidates?.[0]?.parts?.[0]?.text || 'No response generated';
  

      setMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      if (error.response) {
        console.error('Response error:', error.response.data);
      }
      setMessages(prev => [...prev, { 
        type: 'ai', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }
  
    setUserInput('');
  };
  
  
  
  
  




  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);

  // Chat state for the workout plan interaction
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [workoutPlan, setWorkoutPlan] = useState(null);





  useEffect(() => {
    const fetchBodyParts = async () => {
      try {
        const response = await axios.get(
          'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
          {
            headers: {
              'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
              'x-rapidapi-key': '9793f1efa5msh446c7d4d3a3f3a8p108045jsnf31feec0bfe8', 
            },
          }
        );
        setBodyParts(response.data);
      } catch (error) {
        console.error('Error fetching body parts:', error);
      }
    };

    fetchBodyParts();
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const url = selectedBodyPart
          ? `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${selectedBodyPart}`
          : 'https://exercisedb.p.rapidapi.com/exercises';

        const response = await axios.get(url, {
          headers: {
            'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
            'x-rapidapi-key': '9793f1efa5msh446c7d4d3a3f3a8p108045jsnf31feec0bfe8', 
          },
        });

        setExercises(response.data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [selectedBodyPart]);

  // Handle exercise popup details
  const handleShowPopup = (exercise) => {
    setSelectedExercise(exercise);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedExercise(null);
  };

  const fetchYoutubeLink = async (exerciseName) => {
    try {
      const youtubeResponse = await axios.get(
        `https://youtube-search-and-download.p.rapidapi.com/search?query=${exerciseName} exercise`,
        {
          headers: {
            'x-rapidapi-host': 'youtube-search-and-download.p.rapidapi.com',
            'x-rapidapi-key': '9793f1efa5msh446c7d4d3a3f3a8p108045jsnf31feec0bfe8', 
          },
        }
      );

      const videoId = youtubeResponse.data.contents[0]?.video?.videoId;
      return videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#';
    } catch (error) {
      console.error('Error fetching YouTube link:', error);
      return '#';
    }
  };


  const handleChatInput = async () => {
    try {
      console.log('User Input:', userInput); 
  
      const apiKey = 'AIzaSyCLb6c2whOtEMt_pixDLDdjA4zkzo9RFZI'; 
  

      const requestBody = {
        prompt: `Generate a personalized workout plan based on the following input: "${userInput}". Please include exercises, duration, and intensity.`,
        temperature: 0.7,
        maxOutputTokens: 150,
      };
  

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  

      const aiResponse = response.data.content;
      console.log('AI Response:', aiResponse);
  

      setChatMessages([...chatMessages, { user: userInput, ai: aiResponse }]);
      setUserInput(''); 
    
      await db.collection('workout').doc('user_workout_plan').set({
        userInput,
        workoutPlan: aiResponse,
        date: new Date().toISOString(),
      });
      
    } catch (error) {
      console.error('Error in chat interaction:', error);

      if (error.response) {
        console.error('Response error:', error.response);
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
    }
  };
  
  


  
  useEffect(() => {
    if (searchTerm) {
      const filtered = exercises.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.bodyPart.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.target.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredExercises(filtered);
    } else {
      setFilteredExercises(exercises);
    }
  }, [searchTerm, exercises]);
  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  

  const handleSearch = () => {
    const filtered = exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.bodyPart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.target.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExercises(filtered);
  };

  return (
    <div className="container my-4 mx-5">
      <div className="row">
        {/* Left column with exercises */}
        <div className="col-9">
          <h2 
            className={`mb-4 ${styles.t}`}
          >Workout Exercises</h2>

          <div className="mb-3">
            <label htmlFor="bodyPartSelect" className="form-label">
              Select Body Part:
            </label>
            <select
              id="bodyPartSelect"
              className="form-select"
              value={selectedBodyPart}
              onChange={(e) => setSelectedBodyPart(e.target.value)}
            >
              <option value="">All</option>
              {bodyParts.map((part, index) => (
                <option key={index} value={part}>
                  {part}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search exercises by name, body part, equipment, or target muscle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className="btn btn-primary"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>

    {loading ? (
      <div className="row">
        <div className="col">
          <p>Loading exercises...</p>
        </div>
      </div>
    ) : (
            <div className="row" style={{ maxHeight: "465px", overflowY: "auto" }}>
  {exercises.map((exercise, index) => (
    <div key={index} className="col-md-6 mb-3">
      <div className="card mb-3" style={{ maxWidth: "100%" }}>
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={exercise.gifUrl}
              className="img-fluid rounded-start"
              alt={exercise.name || "Exercise"}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 
                className={`card-header ${styles.ch2}`}
              >{exercise.name || "Unknown Exercise"}</h5>
              <p className="card-text">
                <strong>Body Part:</strong> {exercise.bodyPart} <br />
                <strong>Target Muscle:</strong> {exercise.target} <br />
                <strong>Equipment:</strong> {exercise.equipment}
              </p>
              <button
                className="btn btn-primary w-100"
                onClick={async () => {
                  const videoUrl = await fetchYoutubeLink(exercise.name);
                  handleShowPopup({
                    ...exercise,
                    description: exercise.instructions,
                    videoUrl,
                  });
                }}
              >
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

          )}

          {selectedExercise && (
            <ExerciseDetailsPopup
              show={showPopup}
              handleClose={handleClosePopup}
              exercise={selectedExercise}
              videoUrl={selectedExercise.videoUrl}
            />
          )}
        </div>

        {/* Right column with Chat */}
        <div className="col-3" style={{marginTop:"95px"}}>
          <div
            className={`card ${styles.c}`}
          >
            <div className={`card-header ${styles.ch}`}>
              AI Workout Assistant
            </div>
            <div className="card-body">
              <div className="chat-messages" style={{ height: '400px', overflowY: 'auto', marginBottom: '10px' }}>
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className={`message-content ${message.type === 'user' ? 'bg-primary text-white' : 'bg-light'} p-2 mb-2 rounded`}>
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask about workouts..."
                />
                <button 
                  className="btn btn-primary w-100"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>





      </div>
    </div>
  );
}

export default Workout;
