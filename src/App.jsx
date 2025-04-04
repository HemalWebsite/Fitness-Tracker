



import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import Navbar from './components/navbar';
import Setup from './components/Setup/Setup';
import Home from './Home';
import FoodSearch from './components/FoodSearch/FoodSearch';
import DisplayFood from './components/FoodSearch/DisplayFood'; 
import Workout from './components/Workout/Workout';
import { auth, db } from './firebase';  
import Login from './components/Login/Login';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }
  

  return (
    <Router>
      {user ? (
        <>
np
          <Navbar />
       
          
          
          <div className="mt-5 container">
            <Routes>
              <Route path="/setup" element={<Setup />} />
              <Route path="/food-search" element={<FoodSearch />} />
              <Route path="/food-log" element={<DisplayFood />} /> 
              <Route path="/workout" element={<Workout />} />
              <Route path="/home" element={<Home />} /> 
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </div>
        </>
      ) : (

        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
