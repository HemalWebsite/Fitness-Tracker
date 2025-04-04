





import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, TextField, Paper, Alert } from '@mui/material';

import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from './firebase';
import { getDoc, doc, setDoc, arrayUnion } from 'firebase/firestore';
import styles from './DisplayFood.module.css';



const APP_ID = 'bc24ce5b';
const API_KEY = '4867a830d98e182e45d79d61a8af1ac2';

function DisplayFood({ foodName, foodVariant, imageUrl, servings }) {
  const [selectedServing, setSelectedServing] = useState(servings[0]);
  const [customServing, setCustomServing] = useState('');
  const [customUnit, setCustomUnit] = useState('g'); // Default to grams
  const [detailedNutrition, setDetailedNutrition] = useState(null);
  const [mealType, setMealType] = useState('');
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  useEffect(() => {
    fetchDetailedNutrition(foodName);
  }, [foodName]);

  const fetchDetailedNutrition = async (item) => {
    const endpoint = `https://trackapi.nutritionix.com/v2/natural/nutrients`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': APP_ID,
        'x-app-key': API_KEY,
        'x-remote-user-id': '0',
      },
      body: JSON.stringify({ query: item })
    });

    if (response.ok) {
      const data = await response.json();
      const nutritionInfo = data.foods[0];
      setDetailedNutrition(nutritionInfo);
    } else {
      console.error('Error fetching detailed nutrition:', response.statusText);
    }
  };

  const handleServingChange = (event) => {
    const selectedOption = servings.find(serving => serving.serving_qty === parseFloat(event.target.value));
    if (selectedOption) {
      setSelectedServing({
        ...selectedOption,
        nf_protein: selectedOption.nf_protein || 0,
        nf_total_carbohydrate: selectedOption.nf_total_carbohydrate || 0,
        nf_total_fat: selectedOption.nf_total_fat || 0,
        nf_sugars: selectedOption.nf_sugars || 0,
        nf_sodium: selectedOption.nf_sodium || 0,
      });
      setCustomServing('');
      setCustomUnit('g');
    }
  };

  const handleCustomServingChange = (event) => {
    setCustomServing(event.target.value);
    setSelectedServing(null);
  };

  const handleCustomUnitChange = (event) => {
    setCustomUnit(event.target.value);
  };

  const calculateNutritionalValues = () => {
    let baseServingQty = selectedServing?.serving_qty || detailedNutrition?.serving_qty || 1;
    let factor = 1;
  
    // If custom serving size is entered, calculate factor based on number of servings
    if (customServing) {
      factor = parseFloat(customServing); // Direct multiplier for number of servings
    }
  
    return {
      protein: (selectedServing?.nf_protein || detailedNutrition?.nf_protein || 0) * factor,
      carbs: (selectedServing?.nf_total_carbohydrate || detailedNutrition?.nf_total_carbohydrate || 0) * factor,
      fats: (selectedServing?.nf_total_fat || detailedNutrition?.nf_total_fat || 0) * factor,
      sugar: (selectedServing?.nf_sugars || detailedNutrition?.nf_sugars || 0) * factor,
      sodium: (selectedServing?.nf_sodium || detailedNutrition?.nf_sodium || 0) * factor,
      calories: (selectedServing?.nf_calories || detailedNutrition?.nf_calories || 0) * factor,
    };
  };
  
  

  const logFood = async () => {
    const nutritionalValues = calculateNutritionalValues();
    console.log(`Preparing to log food: ${foodName}`, nutritionalValues);
  
    try {
      const today = new Date().toISOString().split('T')[0];
      const foodLogRef = doc(db, 'FoodLog', today);
  
      // Step 1: Fetch current macros if they exist
      const foodLogSnap = await getDoc(foodLogRef);
      let currentMacros = {
        total_calories: 0,
        total_protein: 0,
        total_sugar: 0,
        total_sodium: 0,
        total_fats: 0,
        total_carbs: 0,
      };
  
      if (foodLogSnap.exists()) {
        const data = foodLogSnap.data();
        currentMacros = data.macros || currentMacros; // Fallback to zero if no macros exist
      }
  
      // Step 2: Update macros with the new food values
      const updatedMacros = {
        total_calories: currentMacros.total_calories + (nutritionalValues.calories || 0),
        total_protein: currentMacros.total_protein + (nutritionalValues.protein || 0),
        total_sugar: currentMacros.total_sugar + (nutritionalValues.sugar || 0),
        total_sodium: currentMacros.total_sodium + (nutritionalValues.sodium || 0),
        total_fats: currentMacros.total_fats + (nutritionalValues.fats || 0),
        total_carbs: currentMacros.total_carbs + (nutritionalValues.carbs || 0),
      };
  
      // Step 3: Update Firestore
      await setDoc(foodLogRef, {
        items: arrayUnion({
          foodName,
          serving: customServing ? `${customServing} servings` : `${selectedServing.serving_qty} ${selectedServing.serving_unit}`,
          protein: nutritionalValues.protein || 0,
          carbs: nutritionalValues.carbs || 0,
          fats: nutritionalValues.fats || 0,
          sugar: nutritionalValues.sugar || 0,
          sodium: nutritionalValues.sodium || 0,
          calories: nutritionalValues.calories || 0,
          imageUrl,
          mealType,
        }),
        macros: updatedMacros,
      }, { merge: true });
  
  

      console.log(`Macros updated successfully:`, updatedMacros);
      setAlert({ show: true, type: 'success', message: 'Food and macros updated successfully!' });

      setOpen(false); // Close the modal
    } catch (error) {
      console.error('Error logging food:', error);
      setAlert({ show: true, type: 'error', message: `Failed to add food: ${error.message}` });
    }
  };
  
  

  const nutritionalValues = calculateNutritionalValues();

  return (
    <div className="container mt-4">
        <div className="card">
            <div className="">
                <div className={`card-header ${styles.ch}`}>
                    <h4>{foodVariant?.toUpperCase() || 'FOOD ITEM'}</h4>
                </div>
                
                <div className="row">
                    <div className="">
                        <div className="card d-flex flex-row">
                            {imageUrl && (
                                <img 
                                    src={imageUrl} 
                                    className="card-img-left img-fluid" 
                                    alt={foodName} 
                                    style={{ width: "150px", objectFit: "cover" }} 
                                />
                            )}
                            <div className="col-md-9">
                                <div className={`card-body  ${styles.cb2}`}>
                                    <div className={`card-header h2 ${styles.ch1}`}>{foodName}</div>
                                    
                                    <div className="row mt-1">
                                        {/* Row 1 */}
                                        <div className="col-4">
                                            <div className="card bg-light">
                                                <div className={`card-header ${styles.ch3}`}>Calories</div>
                                                <div className={`card-body text-secondary ${styles.cb1}`}>
                                                    {calculateNutritionalValues().calories.toFixed(1)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="card bg-light">
                                                <div className={`card-header ${styles.ch3}`}>Serving</div>
                                                <div className={`card-body text-secondary ${styles.cb1}`}>
                                                    {selectedServing ? `${selectedServing.serving_qty} ${selectedServing.serving_unit}` : `${customServing} ${customUnit}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="card bg-light">
                                                <div className={`card-header ${styles.ch3}`}>Sugar</div>
                                                <div className={`card-body text-secondary ${styles.cb1}`}>
                                                    {calculateNutritionalValues().sugar.toFixed(1)}g
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-2">
                                        {/* Row 2 */}
                                        <div className="col-4">
                                            <div className="card bg-light">
                                                <div className={`card-header ${styles.ch3}`}>Fats</div>
                                                <div className={`card-body text-secondary ${styles.cb1}`}>
                                                    {calculateNutritionalValues().fats.toFixed(1)}g
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="card bg-light">
                                                <div className={`card-header ${styles.ch3}`}>Protein</div>
                                                <div className={`card-body text-secondary ${styles.cb1}`}>
                                                    {calculateNutritionalValues().protein.toFixed(1)}g
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="card bg-light">
                                                <div className={`card-header ${styles.ch3}`}>Sodium</div>
                                                <div className={`card-body text-secondary ${styles.cb1}`}>
                                                    {calculateNutritionalValues().sodium.toFixed(1)}mg
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        className="btn btn-success mt-3" 
                                        style={{ width: "100%"}}
                                        onClick={() => setOpen(true)}
                                    >
                                        Log Food
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      {/* Modal for adding to meal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth style={{backgroundColor:''}}>
        <DialogTitle style={{ backgroundColor: 'rgb(231, 158, 11)', color: 'white', fontFamily: 'Impact', textA: 'ce' }}>{foodName}</DialogTitle>
        <DialogContent dividers>
          <img src={imageUrl} className="img-fluid rounded" alt={foodName} style={{ marginBottom: '10px' }} />
          <h5>Calories: {nutritionalValues.calories.toFixed(1)} kcal</h5>
          <p>Servings: {selectedServing ? `${selectedServing.serving_qty} ${selectedServing.serving_unit}` : `${customServing} servings`}</p>


          <TextField
            label="Meal Type"
            fullWidth
            select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            style={{ marginBottom: '15px' }}
          >
            <MenuItem value="Breakfast">Breakfast</MenuItem>
            <MenuItem value="Lunch">Lunch</MenuItem>
            <MenuItem value="Dinner">Dinner</MenuItem>
            <MenuItem value="Snack">Snack</MenuItem>
          </TextField>

          <div style={{ display: 'flex', marginBottom: '15px' }}>
            <TextField
              label="Custom Serving Size"
              type="number"
              value={customServing}
              onChange={handleCustomServingChange}
              style={{ marginRight: '10px' }}
            />
            {/* <Select
              value={customUnit}
              onChange={handleCustomUnitChange}
            >
              <MenuItem value="g">Grams</MenuItem>
              <MenuItem value="ml">Milliliters</MenuItem>
              <MenuItem value="oz">Ounces</MenuItem>
              <MenuItem value="lb">Pounds</MenuItem>
              <MenuItem value="cup">Cup</MenuItem>
            </Select> */}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} style={{ color: '#black' }}>Cancel</Button>
          <Button onClick={logFood} className='btn btn-primary'variant="contained" style={{ }}>Add</Button>
        </DialogActions>
      </Dialog>
      </div>
  );
}

export default DisplayFood;
