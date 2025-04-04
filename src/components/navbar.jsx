

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { db, auth } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import styles from './navbar.module.css';


function Navbar() {
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  
  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const logDailyData = async () => {
    const today = formatDate(new Date());

    try {

      const docRef = doc(db, "DailyLog", today);
      
      const dataToSave = {};
      if (weight) dataToSave.weight = parseFloat(weight);
      if (bodyFat) dataToSave.bodyFat = parseFloat(bodyFat);

      if (Object.keys(dataToSave).length > 0) {
        await setDoc(docRef, dataToSave, { merge: true });
        console.log("Daily data logged successfully");
      }
    } catch (error) {
      console.error("Error logging daily data:", error);
    }
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleBodyFatChange = (e) => {
    setBodyFat(e.target.value);
  };

  const handleBlur = async () => {
    if (weight || bodyFat) {
      await logDailyData();
    }
  };
  const handleLogout = async () => {

    const confirmLogout = window.confirm('Are you sure you would like to logout?');
    
    if (confirmLogout) {
      try {
        await auth.signOut();
        localStorage.clear();
        navigate('/login');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg bg-body-tertiary fixed-top ${styles.n}`}>
      <div className="container-fluid" style={{marginLeft:'60px', marginRight:'60px'}}>
        <div className="navbar-brand">
          <Link className="nav-link active" to="/home">Home</Link> 
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" to="/food-search">Food Search</Link>
            </li>
            <li className="nav-item">
              <input
                type="text"
                placeholder="Today's Weight"
                style={{ backgroundColor: 'white', borderRadius: '20px', color:'black'}}
                className='mx-3 p-1'
                value={weight}
                onChange={handleWeightChange}
                onBlur={handleBlur}
              />
            </li>
            <li className="nav-item">
              <input
                type="text"
                placeholder="Today's Body Fat%"
                style={{ backgroundColor: 'white', borderRadius: '20px', color:'black'}}
                className=' p-1'
                value={bodyFat}
                onChange={handleBodyFatChange}
                onBlur={handleBlur}
              />
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/workout">Workout</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/setup">Setup</Link> 
            </li>
            <li className="nav-item">
    <button 
      className="nav-link active" 
      onClick={handleLogout}
      style={{ background: 'none', border: 'none', left:'100%' }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
</svg>
    </button>
  </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
