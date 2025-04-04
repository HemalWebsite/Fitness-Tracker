
import 'bootstrap/dist/js/bootstrap';
import FoodCard from './components/FoodCard';
import Card1 from './components/card';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import WeightProgressBar from './WeightProgressBar';
import ParticleBackground from './components/ParticleBackground';
function Home() {
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalSodium, setTotalSodium] = useState(0);
  const [totalSugar, setTotalSugar] = useState(0);
  const [maxCalories, setMaxCalories] = useState(2000);
  const [maxProtein, setMaxProtein] = useState(100);
  const [maxSodium, setMaxSodium] = useState(2300);
  const [maxSugar, setMaxSugar] = useState(50);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weight, setWeight] = useState(null);
  const [bodyFat, setBodyFat] = useState(null);
  const [startWeight, setStartWeight] = useState(0);
  const [goalWeight, setGoalWeight] = useState(0);
  const [startBodyFat, setStartBodyFat] = useState(0);
  const [goalBodyFat, setGoalBodyFat] = useState(0);

  
  // For weight and body fat
  

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };
  useEffect(() => {
    const fetchMacros = async () => {
      // Use the selected date instead of today
      const date = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
      const docRef = doc(db, 'FoodLog', date);

      try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().macros) {
              const macros = docSnap.data().macros;
              setTotalCalories(macros.total_calories || 0);
              setTotalProtein(macros.total_protein || 0);
              setTotalSodium(macros.total_sodium || 0);
              setTotalSugar(macros.total_sugar || 0);
          } else {
              setTotalCalories(0);
              setTotalProtein(0);
              setTotalSodium(0);
              setTotalSugar(0);
          }
      } catch (error) {
          console.error('Error fetching macros:', error);
      }
  };

    
    const fetchGoal = async (goalName, setterFunction, defaultValue) => {
      const setupRef = doc(db, 'Setup', 'userData');
    
      try {
        const setupSnap = await getDoc(setupRef);
        if (setupSnap.exists()) {
          const data = setupSnap.data();
          if (goalName in data) {
            setterFunction(data[goalName]);
          } else {
            setterFunction(defaultValue);
          }
        } else {
          setterFunction(defaultValue);
        }
      } catch (error) {
        console.error(`Error fetching ${goalName}:`, error);
        setterFunction(defaultValue);
      }
    };


    const fetchWeightAndBodyFat = async () => {

      const date = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
      const dailyLogRef = doc(db, 'DailyLog', date);
    
      try {
        const docSnap = await getDoc(dailyLogRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWeight(data.weight || startWeight);
          setBodyFat(data.bodyFat || startBodyFat);
        } else {

          setWeight(startWeight);
          setBodyFat(startBodyFat);
        }
      } catch (error) {
        console.error('Error fetching weight and body fat:', error);
      }
    };
    

    fetchMacros();
    fetchGoal('Calorie Goals', setMaxCalories, 2000);
    fetchGoal('Protein Goals', setMaxProtein, 100);
    fetchGoal('Sodium Goals', setMaxSodium, 2300);
    fetchGoal('Sugar Goals', setMaxSugar, 50);

    fetchWeightAndBodyFat(); 

    fetchMacros();
  }, [selectedDate, startWeight, startBodyFat]); 


  const roundedCalories = Math.round(totalCalories);
  const roundedProtein = Math.round(totalProtein);
  const roundedSodium = Math.round(totalSodium);
  const roundedSugar = Math.round(totalSugar);
  console.log('MV '+maxCalories)
  console.log('RC '+roundedCalories)
  



  const fetchCalorieGoals = async () => {
    try {
      const docRef = doc(db, "Setup", "userData");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
      
        console.log("Fetched Data:", data); 
  

        const calorieGoals = data["Calorie Goals"]?.value; 
        setMaxCalories(calorieGoals || 0);
        
        console.log("Calorie Goals:", calorieGoals);
      } else {
        console.warn("No document found.");
      }
    } catch (error) {
      console.error("Error fetching calorie goals:", error);
    }
  };
  

  fetchCalorieGoals();


  console.log('CalorieGoals'+maxCalories )


  const fetchProteinGoals = async () => {
    try {
      const docRef = doc(db, "Setup", "userData");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
      
        console.log("Fetched Data:", data); 
  

        const calorieGoals = data["Protein Goals"]?.value; 
        setMaxProtein(calorieGoals || 0);
        
        console.log("Protein Goals:", calorieGoals);
      } else {
        console.warn("No document found.");
      }
    } catch (error) {
      console.error("Error fetching Protein goals:", error);
    }
  };
  

  fetchProteinGoals();


  console.log('CalorieGoals'+maxProtein )


  const fetchSodiumGoals = async () => {
    try {
      const docRef = doc(db, "Setup", "userData");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
      
        console.log("Fetched Data:", data); 
  

        const calorieGoals = data["Sodium Goals"]?.maxValue; 
        setMaxSodium(calorieGoals || 0);
        
        console.log("Sodium Goals1:", calorieGoals);
      } else {
        console.warn("No document found.");
      }
    } catch (error) {
      console.error("Error fetching Protein goals:", error);
    }
  };
  

  fetchSodiumGoals();


  console.log('CalorieGoals'+maxSodium )



  const fetchSugarGoals = async () => {
    try {
      const docRef = doc(db, "Setup", "userData");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
      
        console.log("Fetched Data:", data); 
  

        const calorieGoals = data["Sugar Goals"]?.maxValue; 
        setMaxSugar(calorieGoals || 0);
        
        console.log("Sugar Goals:", calorieGoals);
      } else {
        console.warn("No document found.");
      }
    } catch (error) {
      console.error("Error fetching Protein goals:", error);
    }
  };
  

  fetchSugarGoals();


  console.log('CalorieGoals'+maxSugar )








const fetchGoals = async () => {
  const setupRef = doc(db, 'Setup', 'userData');
  
  try {
    const docSnap = await getDoc(setupRef);
    if (docSnap.exists()) {
      const data = docSnap.data();

      setStartWeight(data['Current Weight']?.value || 0);
      setStartBodyFat(data['Current Body Fat Percentage']?.value || 0);

      setGoalWeight(data['Weight Goal']?.value || 0);
      setGoalBodyFat(data['Body Fat Percentage Goal']?.value || 0);
    }
  } catch (error) {
    console.error('Error fetching goals:', error);
  }
};


useEffect(() => {
  fetchGoals();

}, []);




  return (
    <div className="mt-4 container mx-5 my-4" style={{ position: 'relative' }}>
       <ParticleBackground />
      <div className="row" style={{ position: 'relative', zIndex: 1 }}>
      <div className="col-8">
        <div style={{ 
          height: '1000px',     
          overflowY: 'auto',    
          paddingRight: '15px'  
        }}>
          <FoodCard onDateChange={handleDateChange} />
        </div>
      </div>

        <div className="col-4" style={{ marginTop: "75px" }}>
          
          <div className="row mb-2">
            <div className="col-6">
              <Card1 header="Calories" value={roundedCalories} MV={maxCalories } color="#dc3545" />
            </div>
            <div className="col-6">
              <Card1 header="Protein" value={roundedProtein} MV={maxProtein} color="#dc3545" />
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-6">
              <Card1 header="Sodium" value={roundedSodium/1000} MV={maxSodium} color="#dc3545" />
            </div>
            <div className="col-6">
              <Card1 header="Sugar" value={roundedSugar} MV={maxSugar} color="#dc3545" />
            </div>
          </div>



          <div className="row">
  <div className="col-12 mb-3">
    <WeightProgressBar
      currentValue={weight || startWeight}
      startValue={startWeight}
      goalValue={goalWeight}
      title="Weight Progress"
      unit="kg"
    />
  </div>
  <div className="col-12">
    <WeightProgressBar
      currentValue={bodyFat || startBodyFat}
      startValue={startBodyFat}
      goalValue={goalBodyFat}
      title="Body Fat Progress"
      unit="%"
    />
  </div>
</div>




        </div>
      </div>
    </div>
  );
}

export default Home;
