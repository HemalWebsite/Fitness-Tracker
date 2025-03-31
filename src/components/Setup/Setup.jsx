import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import CustomAccordion from './CustomAccordion';
import RangeSlider from './RangeSlider';
import CustomDateRangeCalendar from './CustomDateRangeCalender';
import GoalRangeInput from './GoalRangeInput';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from './Setup.module.css';
import HealthReport from './HealthReport';
import { width } from '@mui/system';



function Setup() {
  const userId = "userData"; // Replace this with the actual userId or get it dynamically
  const [userData, setUserData] = useState({
    gender: 'Male',
    age: 0,
    height: 0,
    weight: 0,
    weightGoal: 0,
    bodyFatGoal: 0,
    activityLevel: 'Sedentary',
    bmi: 0,
    bmr: 0,
    tdee: 0,
    profile: 'regular',
  });

  const [weightCalories, setWeightCalories] = useState("");

  const [proteinGoal, setProteinGoal] = useState(0);

  // const fetchUserData = async () => {
  //   try {
  //     const docRef = doc(db, "Setup", userId);
  //     const docSnap = await getDoc(docRef);
  
  //     if (docSnap.exists()) {
  //       const data = docSnap.data();
  //       setUserData({
  //         gender: data.gender || 'Male',
  //         age: data.age || 0,
  //         height: parseFloat(data.height) || 0,
  //         weight: data["Current Weight"]?.value || 0, // Fetch nested "Current Weight.value"
  //         weightGoal: data["Weight Goal"]?.value || 0, // Fetch nested "Weight Goal.value"
  //         bodyFatGoal: data["Body Fat Percentage Goal"]?.value || "Not Set", // Fetch nested "Body Fat Percentage Goal.value"
  //         activityLevel: data.activityLevel || 'Sedentary',
  //         bmi: calculateBMI(data["Current Weight"]?.value || 0, parseFloat(data.height) || 0),
  //         bmr: calculateBMR(data.gender || 'Male', data["Current Weight"]?.value || 0, parseFloat(data.height) || 0, data.age || 0),
  //         tdee: calculateTDEE(
  //           calculateBMR(data.gender || 'Male', data["Current Weight"]?.value || 0, parseFloat(data.height) || 0, data.age || 0),
  //           data.activityLevel || 'Sedentary'
  //         ),
  //       });
  //     } else {
  //       console.log("No such document!");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching document: ", error);
  //   }
  // };
  
  

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  // const calculateBMI = (weight, height) => {
  //   const heightM = height / 100;
  //   return (weight / (heightM * heightM)).toFixed(1);
  // };

  // const calculateBMR = (gender, weight, height, age) => {
  //   if (gender === 'Male') {
  //     return (88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)).toFixed(0);
  //   } else {
  //     return (447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)).toFixed(0);
  //   }
  // };

  // const calculateTDEE = (bmr, activityLevel) => {
  //   const activityMultiplier = {
  //     Sedentary: 1.2,
  //     LightlyActive: 1.375,
  //     ModeratelyActive: 1.55,
  //     VeryActive: 1.725,
  //     ExtremelyActive: 1.9,
  //   };
  //   return (bmr * activityMultiplier[activityLevel]).toFixed(0);
  // };
  const fetchUserData = async () => {
    try {
      const docRef = doc(db, "Setup", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          gender: data.gender || 'Male',
          age: data.age || 0,
          height: parseFloat(data.height) || 0,
          weight: data["Current Weight"]?.value || 0,
          weightGoal: data["Weight Goal"]?.value || 0,
          bodyFatGoal: data["Body Fat Percentage Goal"]?.value || "Not Set",
          activityLevel: data.activityLevel || 'Sedentary',
          bmi: calculateBMI(data["Current Weight"]?.value || 0, parseFloat(data.height) || 0),
          bmr: calculateBMR(data.gender || 'Male', data["Current Weight"]?.value || 0, parseFloat(data.height) || 0, data.age || 0),
          tdee: calculateTDEE(
            calculateBMR(data.gender || 'Male', data["Current Weight"]?.value || 0, parseFloat(data.height) || 0, data.age || 0),
            data.activityLevel || 'Sedentary'
          ),
        });
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, []);

  const calculateBMI = (weight, height) => {
    const heightM = height / 100;
    return (weight / (heightM * heightM)).toFixed(1);
  };

  const calculateBMR = (gender, weight, height, age) => {
    if (gender === 'Male') {
      return (88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)).toFixed(0);
    } else {
      return (447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)).toFixed(0);
    }
  };

  const calculateTDEE = (bmr, activityLevel) => {
    const activityMultiplier = {
      Sedentary: 1.2,
      LightlyActive: 1.375,
      ModeratelyActive: 1.55,
      VeryActive: 1.725,
      ExtremelyActive: 1.9,
    };
    return (bmr * activityMultiplier[activityLevel]).toFixed(0);
  };



  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text("Health Report", 105, 15, { align: "center" });
    
    // Personal Information Table
    doc.setFontSize(14);
    doc.text("Personal Information", 20, 30);
    
    const personalInfoData = [
      ["Age", userData.age],
      ["Gender", userData.gender],
      ["Activity Level", userData.activityLevel],
      ["Height", `${userData.height} cm`],
    ];
    
    autoTable(doc, {
      head: [["Metric", "Value"]],
      body: personalInfoData,
      startY: 35,
      margin: { left: 20 },
      theme: 'grid',
      headStyles: { fillColor: [71, 71, 71] },
    });
    
    // Goals Table
    doc.text("Goals", 20, doc.lastAutoTable.finalY + 15);
    
    const goalsData = [
      ["Current Weight", `${userData.weight} kg`],
      ["Weight Goal", `${userData.weightGoal} kg`],
      ["Current Body Fat %", `${userData.bodyFat || "Not Set"}%`],
      ["Body Fat % Goal", `${userData.bodyFatGoal}%`],
    ];
    
    autoTable(doc, {
      head: [["Goal Type", "Value"]],
      body: goalsData,
      startY: doc.lastAutoTable.finalY + 20,
      margin: { left: 20 },
      theme: 'grid',
      headStyles: { fillColor: [71, 71, 71] },
    });
    
    // Nutrition Requirements Table
    doc.text("Daily Nutrition Requirements", 20, doc.lastAutoTable.finalY + 15);
    
    // Calculate protein requirements based on profile
    const calculateProteinRequirement = () => {
      const baseMultiplier = {
        bodybuilder: 2.2,
        athlete: 1.8,
        pregnant: 1.5,
        regular: 0.8
      };
      
      // You can add more complex logic here based on age, gender, etc.
      const multiplier = baseMultiplier[userData.profile] || baseMultiplier.regular;
      return (userData.weight * multiplier).toFixed(1);
    };
    
    const nutritionData = [
      ["Target Calories", `${userData.tdee} kcal`],
      ["Target Protein", `${calculateProteinRequirement()} g`],
    ];
    
    autoTable(doc, {
      head: [["Nutrient", "Daily Target"]],
      body: nutritionData,
      startY: doc.lastAutoTable.finalY + 20,
      margin: { left: 20 },
      theme: 'grid',
      headStyles: { fillColor: [71, 71, 71] },
    });
    
   
    doc.text("Progress Over Time", 20, doc.lastAutoTable.finalY + 15);


    
    // Save the PDF
    doc.save("health_report.pdf");
  };










  const calculateProteinRequirement = (weight, profile) => {
    const baseMultiplier = {
      bodybuilder: 2.2,
      athlete: 1.8,
      pregnant: 1.5,
      regular: 0.8
    };
    
    const multiplier = baseMultiplier[profile] || baseMultiplier.regular;
    return Math.round(weight * multiplier);
  };
  const updateProteinGoals = async (weight, profile) => {
    try {
      const proteinGoal = calculateProteinRequirement(weight, profile);
      
      await setDoc(doc(db, "Setup", "userData"), {
        "Protein Goals": {
          value: proteinGoal,
          minValue: proteinGoal * 0.9, // Optional: Add min/max range
          maxValue: proteinGoal * 1.1
        }
      }, { merge: true });
      
      console.log("Protein goal updated successfully:", proteinGoal);
    } catch (error) {
      console.error("Error updating protein goals:", error);
    }
  };
  
  useEffect(() => {
    if (userData.weight && userData.profile) {
      updateProteinGoals(userData.weight, userData.profile);
    }
  }, [userData.weight, userData.profile]);
  
  
  const fetchProteinGoal = async () => {
    try {
      const docRef = doc(db, "Setup", "userData");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        const proteinGoalValue = data["Protein Goals"]?.value || 0;
        setProteinGoal(proteinGoalValue);
      }
    } catch (error) {
      console.error("Error fetching protein goal:", error);
    }
  };
  

  useEffect(() => {
    fetchUserData();
    fetchProteinGoal();
  }, []);
  


  useEffect(() => {
    const bmi = calculateBMI(userData.weight, userData.height);
    const bmr = calculateBMR(userData.gender, userData.weight, userData.height, userData.age);
    const tdee = calculateTDEE(bmr, userData.activityLevel);
    setUserData(prevState => ({
      ...prevState,
      bmi,
      bmr,
      tdee,
    }));
  }, [userData.weight, userData.height, userData.age, userData.gender, userData.activityLevel]);

  const handleInputChange = async (inputType, value) => {
    try {
      const updatedUserData = { ...userData, [inputType]: value };
  
      // Update Firestore
      await setDoc(doc(db, "Setup", userId), { [inputType]: value }, { merge: true });
  
      // Update BMI, BMR, and TDEE dynamically
      updatedUserData.bmi = calculateBMI(updatedUserData.weight, updatedUserData.height);
      updatedUserData.bmr = calculateBMR(updatedUserData.gender, updatedUserData.weight, 
        updatedUserData.height, updatedUserData.age);
      updatedUserData.tdee = calculateTDEE(updatedUserData.bmr, updatedUserData.activityLevel);
      
      if (inputType === 'weight' || inputType === 'profile') {
        await updateProteinGoals(
          inputType === 'weight' ? value : updatedUserData.weight,
          inputType === 'profile' ? value : updatedUserData.profile
        );
      }

      setUserData(updatedUserData);
      console.log(`${inputType} saved: ${value}`);
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };
  

  const handleSliderChange = async (goalType, value) => {
    try {
      await setDoc(doc(db, "Setup", userId), {
        [goalType]: {
          value: value,
        }
      }, { merge: true });
  
      // Only reset choice if weight-related values change
      if (goalType === 'Current Weight' || goalType === 'Weight Goal') {
        await resetUserChoice();
      }
  
      console.log(`${goalType} value saved: ${value}`);
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };
  

  const handleDateChange = async (goalType, dates) => {
    try {
      const [startDate, endDate] = dates;
      await setDoc(doc(db, "Setup", userId), {
        [goalType]: {
          startDate: startDate?.toISOString().split('T')[0],
          endDate: endDate?.toISOString().split('T')[0],
        }
      }, { merge: true });
      
      // Trigger recalculation after timeline changes
      if (goalType === 'Weight Goals Timeline') {
        calculateWeightGoalCalories();
      }
      
      console.log(`${goalType} timeline saved: Start Date - ${startDate}, End Date - ${endDate}`);
    } catch (error) {
      console.error("Error saving timeline: ", error);
    }
  };
  

  const handleSave = async (goalType, minValue, maxValue) => {
    try {
      await setDoc(doc(db, "Setup", userId), {
        [goalType]: {
          minValue: minValue,
          maxValue: maxValue,
        }
      }, { merge: true });
      console.log(`${goalType} saved: Min Value - ${minValue}, Max Value - ${maxValue}`);
    } catch (error) {
      console.error("Error saving range data: ", error);
    }
  };

  

  const [showHealthAlert, setShowHealthAlert] = useState(false);
const [useRecommendedPlan, setUseRecommendedPlan] = useState(false);





const calculateWeightGoalCalories = async () => {
  try {
    const docRef = doc(db, "Setup", userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error("User data not found");
    }

    const data = docSnap.data();
    const weightPlan = data["Weight Plan"];
    const weightGoalsTimeline = data["Weight Goals Timeline"];

    // If user has already made a choice and saved it, use those values
    if (weightPlan?.hasUserMadeChoice) {
      const message = weightPlan.useRecommendedPlan ? 
        `Your Daily Calorie Target: ${Math.round(weightPlan.calories)} calories\n\n` +
        `Following the recommended plan:\n` +
        `• Timeline: ${weightPlan.recommendedDays} days\n` +
        `• This ensures a healthy and sustainable rate` :
        `Your Daily Calorie Target: ${Math.round(weightPlan.calories)} calories\n\n` +
        `Following your plan:\n` +
        `• Timeline: ${weightPlan.userDays} days\n` +
        `• Note: This plan may not be optimal for your health`;
      
      setWeightCalories(message);
      return;
    }

    const startDate = new Date(weightGoalsTimeline.startDate);
    const endDate = new Date(weightGoalsTimeline.endDate);
    const userDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    const weight = parseFloat(userData.weight);
    const goal = parseFloat(userData.weightGoal);
    const TDEE = parseFloat(userData.tdee);

    if (isNaN(userDays) || userDays <= 0) {
      throw new Error("Invalid timeline");
    }

    const weightDifference = Math.abs(goal - weight);
    const isWeightLoss = weight > goal;
    
    // Calculate recommended timeline based on 500 calorie deficit
    const recommendedDays = Math.ceil((weightDifference * 7700) / 500); // 7700 calories = 1kg

    let userCalories, recommendedCalories;

    if (isWeightLoss) {
      // For weight loss
      recommendedCalories = TDEE - 500; // Recommended plan always uses 500 calorie deficit
      const calculatedDeficit = ((weightDifference * 7700) / userDays);
      const calculatedUserCalories = TDEE - calculatedDeficit;
    
      // Only show health alert if the deficit is too large and calculated calories are less than recommended
      if (!hasUserMadeChoice && calculatedDeficit > 500 && calculatedUserCalories < recommendedCalories) {
        setShowHealthAlert({
          message: `Your current timeline of ${userDays} days would require an unsafe calorie deficit.\n` +
                  `We recommend a maximum deficit of 500 calories per day for healthy weight loss.\n` +
                  `• Current plan: ${Math.round(calculatedUserCalories)} calories/day\n` +
                  `• Recommended plan: ${Math.round(recommendedCalories)} calories/day\n` +
                  `This will take approximately ${recommendedDays} days.\n` +
                  `Would you like to use the recommended plan?`,
          recommendedCalories,
          userCalories: calculatedUserCalories,
          recommendedDays,
          userDays
        });
      } else if (!hasUserMadeChoice) {
        // Automatically use user's plan if their calories are higher than recommended
        const planData = {
          useRecommendedPlan: false,
          hasUserMadeChoice: true,
          calories: Math.round(calculatedUserCalories),
          recommendedDays: recommendedDays,
          userDays: userDays
        };
    
        await setDoc(doc(db, "Setup", userId), {
          "Weight Plan": planData,
          "Calorie Goals": {
            value: Math.round(calculatedUserCalories)
          }
        }, { merge: true });
        
        setUseRecommendedPlan(false);
        setHasUserMadeChoice(true);
        setShowHealthAlert(null);
      }
    }
    
     else {
      // Weight Gain calculations
      recommendedCalories = TDEE + 500; // Maximum surplus of 500 calories
      const calculatedUserCalories = TDEE + ((weightDifference * 7700) / userDays);
    
      if (!hasUserMadeChoice && (calculatedUserCalories - TDEE > 500)) {
        setShowHealthAlert({
          message: `Your current timeline would require an excessive calorie surplus.\n` +
                  `We recommend a maximum surplus of 500 calories per day for healthy weight gain.\n` +
                  `• Current plan: ${Math.round(calculatedUserCalories)} calories/day\n` + // Show actual calculated calories
                  `• Recommended plan: ${Math.round(recommendedCalories)} calories/day\n` +
                  `This will take approximately ${recommendedDays} days.\n` +
                  `Would you like to use the recommended plan?`,
          recommendedCalories,
          userCalories: calculatedUserCalories, // Use actual calculated calories
          recommendedDays,
          userDays
        });
      }
    }
    

  } catch (error) {
    console.error("Error in calculation:", error);
    setWeightCalories("Please set a timeline for your weight goal in the Weight Goals section.");
  }
};











// // Add this JSX for the alert
// {showHealthAlert && (
//   <div className="alert alert-warning">
//     <p>{showHealthAlert.message}</p>
//     <button 
//       className="btn btn-success mr-2" 
//       onClick={() => {
//         setUseRecommendedPlan(true);
//         calculateWeightGoalCalories();
//       }}
//     >
//       Use Recommended Plan
//     </button>
//     <button 
//       className="btn btn-secondary" 
//       onClick={() => {
//         setUseRecommendedPlan(false);
//         calculateWeightGoalCalories();
//       }}
//     >
//       Keep My Plan
//     </button>
//   </div>
// )}

  
useEffect(() => {
  const fetchWeightPlan = async () => {
    try {
      const docRef = doc(db, "Setup", userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const weightPlan = data["Weight Plan"];
        
        if (weightPlan) {
          setUseRecommendedPlan(weightPlan.useRecommendedPlan || false);
          setHasUserMadeChoice(weightPlan.hasUserMadeChoice || false);
          
          if (weightPlan.hasUserMadeChoice) {
            const message = weightPlan.useRecommendedPlan ? 
              `Your Daily Calorie Target: ${Math.round(weightPlan.calories)} calories\n\n` +
              `Following the recommended plan:\n` +
              `• Timeline: ${weightPlan.recommendedDays} days\n` +
              `• This ensures a healthy and sustainable rate` :
              `Your Daily Calorie Target: ${Math.round(weightPlan.calories)} calories\n\n` +
              `Following your plan:\n` +
              `• Timeline: ${weightPlan.userDays} days\n` +
              `• Note: This plan may not be optimal for your health`;
            
            setWeightCalories(message);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching weight plan:", error);
    }
  };

  fetchWeightPlan();
}, []);





useEffect(() => {
  if (userData.weight && userData.weightGoal && userData.tdee && userData.bmr) {
    calculateWeightGoalCalories();
  }
}, [userData.weight, userData.weightGoal, userData.tdee, userData.bmr, userData["Weight Goals Timeline"]]);


useEffect(() => {
  const handleTimelineChange = async () => {
    const docRef = doc(db, "Setup", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data["Weight Goals Timeline"]) {
        calculateWeightGoalCalories();
      }
    }
  };

  handleTimelineChange();
}, []);


const resetUserChoice = async () => {
  try {
    await setDoc(doc(db, "Setup", userId), {
      "Weight Plan": {
        hasUserMadeChoice: false
      }
    }, { merge: true });
    setHasUserMadeChoice(false);
  } catch (error) {
    console.error("Error resetting choice:", error);
  }
};

// Add effect to reset choice when values change


const [hasUserMadeChoice, setHasUserMadeChoice] = useState(false);

const saveUserChoice = async (isRecommended, calories) => {
  try {
    await setDoc(doc(db, "Setup", userId), {
      "Weight Plan": {
        useRecommendedPlan: isRecommended,
        hasUserMadeChoice: true,
        calories: Math.round(calories)
      },
      "Calorie Goals": {
        value: Math.round(calories)
      }
    }, { merge: true });
  } catch (error) {
    console.error("Error saving user choice:", error);
  }
};

// useEffect(() => {
//   if (userData.weight || userData.weightGoal || userData["Weight Goals Timeline"]) {
//     resetUserChoice();
//   }
// }, [userData.weight, userData.weightGoal, userData["Weight Goals Timeline"]]);

  



  return (
    <div className='container mx-5 my-4'>
      <div className="row">
        <div className="col-6">
        <div 
          className={`card mt-5 px-5 py-3 ${styles.c}`}
        >
  <div className={` ${styles.d}`}>Energy Required to Survive per Day: {userData.bmr}</div><br />
  <div className={` ${styles.d}`}>Total Daily Energy Expenditure: {userData.tdee}</div><br />
  <div className={` ${styles.d}`}>BMI: {userData.bmi}</div><br />
  <div className={` ${styles.d}`}>Weight Goal: {userData.weightGoal}</div><br />
  <div className={` ${styles.d}`}>Body Fat % Goal: {userData.bodyFatGoal || "Not Set"}%</div><br />
  <div className={` ${styles.d}`}>Daily Protein Goal: {proteinGoal}g</div><br />
  <div  className={`weight-calc-result ${styles.d}`} style={{ whiteSpace: 'pre-line' }}>
    {weightCalories}
  </div>
  
  {/* Add the alert here */}



  {showHealthAlert && !hasUserMadeChoice && (
  <div className="alert alert-warning mt-3">
    <p style={{ whiteSpace: 'pre-line' }}>{showHealthAlert.message}</p>
    <div className="mt-3">
    <button 
      className="btn btn-success me-2" 
      onClick={async () => {
        try {
          const planData = {
            useRecommendedPlan: true,
            hasUserMadeChoice: true,
            calories: Math.round(showHealthAlert.recommendedCalories),
            recommendedDays: showHealthAlert.recommendedDays,
            userDays: showHealthAlert.userDays
          };

          await setDoc(doc(db, "Setup", userId), {
            "Weight Plan": planData,
            "Calorie Goals": {
              value: Math.round(showHealthAlert.recommendedCalories)
            }
          }, { merge: true });
          
          setUseRecommendedPlan(true);
          setHasUserMadeChoice(true);
          setShowHealthAlert(null);
          calculateWeightGoalCalories();
        } catch (error) {
          console.error("Error saving choice:", error);
        }
      }}
    >
  Use Recommended Plan
</button>


<button 
  className="btn btn-secondary" 
  onClick={async () => {
    try {
      const planData = {
        useRecommendedPlan: false,
        hasUserMadeChoice: true,
        calories: Math.round(showHealthAlert.userCalories),
        recommendedDays: showHealthAlert.recommendedDays,
        userDays: showHealthAlert.userDays
      };

      await setDoc(doc(db, "Setup", userId), {
        "Weight Plan": planData,
        "Calorie Goals": {
          value: Math.round(showHealthAlert.userCalories)
        }
      }, { merge: true });
      
      setUseRecommendedPlan(false);
      setHasUserMadeChoice(true);
      setShowHealthAlert(null);
      calculateWeightGoalCalories();
    } catch (error) {
      console.error("Error saving choice:", error);
    }
  }}
>
  Keep My Plan
</button>


    </div>
  </div>
)}



</div>


        </div>
        <div className="col-6">
          <div className="row">
          <div className="card mt-5 px-5 py-3">
          <div className="row">
            <select
              className="form-control mt-2"
              id="gender"
              value={userData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          {/* <div className="row">
            <input
              type="number"
              className="form-control mt-2"
              placeholder="Age"
              value={userData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
            />
          </div> */}
          <div className="row">
            <input
              type="date"
              className="form-control mt-2"
              placeholder="Birthday"
              value={userData.birthday || ''}
              onChange={(e) => handleInputChange('birthday', e.target.value)}
            />
          </div>
          <div className="row">
            <input
              type="number"
              className="form-control mt-2"
              placeholder="Height"
              value={userData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
            />
          </div>
          <div className="row">
            <select
              className="form-control mt-2"
              id="activityLevel"
              value={userData.activityLevel}
              onChange={(e) => handleInputChange('activityLevel', e.target.value)}
            >
              <option value="Sedentary">Sedentary (Less than 30 min of intentional exercise per day)</option>
              <option value="LightlyActive">Lightly Active (30-60 min of intentional exercise per day)</option>
              <option value="ModeratelyActive">Moderately Active (60-90 min of intentional exercise per day)</option>
              <option value="VeryActive">Very Active (90-150 min of intentional exercise per day)</option>
              <option value="ExtremelyActive">Extremely Active (150+ min of intentional exercise per day)</option>
            </select>
          </div>
          <div className="row">
          <select
  className="form-control mt-2"
  value={userData.profile}
  onChange={(e) => handleInputChange('profile', e.target.value)}
>
  <option value="regular">Regular</option>
  <option value="bodybuilder">Bodybuilder</option>
  <option value="athlete">Athlete</option>
  <option value="pregnant">Pregnant</option>
</select>

          </div>

            
            <div className="row">
              <button className="btn btn-primary mt-3 w-100">Save</button>
            </div>
          </div>
          </div>

          <div className="row mt-4">
            <div className="col-6">
              <div className="card">
                <div className={`card-header ${styles.ch}`}>
                  <h3>Fat Goals</h3>
                </div>
                <CustomAccordion header="Fat Goals">
                  <div> <b>Current Body Fat Percentage:</b></div>
                  <RangeSlider
                    min={5}
                    max={30}
                    defaultValue={15}
                    label="Fat (%)"
                    onChange={(value) => handleSliderChange('Current Body Fat Percentage', value)}
                  />
                  <br />
                  <div> <b>Body Fat Percentage Goal:</b></div>
                  <RangeSlider
                    min={5}
                    max={30}
                    defaultValue={15}
                    label="Fat (%)"
                    onChange={(value) => handleSliderChange('Body Fat Percentage Goal', value)}
                  />
                </CustomAccordion>
                <CustomAccordion header="Timeline">
                  <CustomDateRangeCalendar onDateChange={(dates) => handleDateChange('Fat Goals Timeline', dates)} />
                </CustomAccordion>
              </div>
            </div>
            <div className="col-6">
              <div className="card">
                <div className={`card-header ${styles.ch}`}>
                  <h3>Weight Goals</h3>
                </div>
                <CustomAccordion header="Weight Goals">
                  <div> <b>Current Weight:</b></div>
                  <RangeSlider
                    min={20}
                    max={150}
                    defaultValue={50}
                    label="Weight (kg)"
                    onChange={(value) => handleSliderChange('Current Weight', value)}
                  />
                  <br />
                  <div> <b>Weight Goal:</b></div>
                  <RangeSlider
                    min={20}
                    max={150}
                    defaultValue={50}
                    label="Weight (kg)"
                    onChange={(value) => handleSliderChange('Weight Goal', value)}
                  />
                </CustomAccordion>
                <CustomAccordion header="Timeline">
                  <CustomDateRangeCalendar onDateChange={(dates) => handleDateChange('Weight Goals Timeline', dates)} />
                </CustomAccordion>
              </div>
            </div>
            
          </div>
          <div className="row mt-4">
            <div className="col-6">
                <div className="card">
                <div className={`card-header ${styles.ch}`}>
                  <h3>Sugar Levels</h3>
                </div>
                <CustomAccordion header="Sugar Levels">
                  Sugar intake requirements:
                  <GoalRangeInput goalType="Sugar Goals" onSave={handleSave} />
                </CustomAccordion>
              </div>
            </div>
            <div className="col-6">
                <div className="card">
                <div className={`card-header ${styles.ch}`}>
                  <h3>Sodium Levels</h3>
                </div>
                <CustomAccordion header="Sodium Levels">
                  Sodium intake requirements:
                  <GoalRangeInput goalType="Sodium Goals" onSave={handleSave} />
                </CustomAccordion>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <div className="row">
        <div className="col-6">
        
        </div>
        <div className="col-6">
         
        </div>
        {/* <div className="col-4">
          <div className="card">
            <div className="card-header">
              <h3>Custom Goal</h3>
            </div>
            <CustomAccordion header="Calorie Goals">
              Here you can define your calorie goals.
              <RangeSlider
                min={0}
                max={5000}
                defaultValue={1500}
                label="Calories"
                onChange={(value) => handleSliderChange('Calorie Goals', value)}
              />
            </CustomAccordion>
            <CustomAccordion header="Timeline">
              <CustomDateRangeCalendar onDateChange={(dates) => handleDateChange('Calorie Goals Timeline', dates)} />
            </CustomAccordion>
          </div>
        </div> */}
      </div>
      <div className="row ">
        {/* <div className="col-4">
          <div className="card">
            <div className="card-header">
              <h3>Custom Health Requirement</h3>
            </div>
            <div className="card-text">
              <input type="text" style={{width:'100%'}}/>
            </div>
          </div>
        </div> */}
        {/* <div className="col-4">
          <div className="card">
            <div className="card-header">
              <h3>Sugar Levels</h3>
            </div>
            <CustomAccordion header="Sugar Levels">
              Sugar intake requirements:
              <GoalRangeInput goalType="Sugar Goals" onSave={handleSave} />
            </CustomAccordion>
          </div>
        </div> */}
        {/* <div className="col-4">
          <div className="card">
            <div className="card-header">
              <h3>Sodium Levels</h3>
            </div>
            <CustomAccordion header="Sodium Levels">
              Sodium intake requirements:
              <GoalRangeInput goalType="Sodium Goals" onSave={handleSave} />
            </CustomAccordion>
          </div>
        </div> */}
      </div>
      <div className="row my-2">
        <div className="mt-2">
          <button className="btn btn-primary" style={{width:'100%'}} onClick={generatePDF}>Print Report</button>
        </div>
      </div>
    </div>
  );
}

export default Setup;

