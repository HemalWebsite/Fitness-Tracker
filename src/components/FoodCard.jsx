

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { getDoc, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './FoodCard.module.css';

function FoodCard({ onDateChange }) {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const formatDate = (date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    const changeDate = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
        onDateChange(newDate); 
    };

    useEffect(() => {
        const fetchFoodLog = async () => {
            try {
                const date = formatDate(selectedDate);
                const docRef = doc(db, 'FoodLog', date);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFoodItems(docSnap.data().items || []);
                } else {
                    setFoodItems([]);
                }
            } catch (err) {
                setError("Error fetching food log");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFoodLog();
    }, [selectedDate]);

    const deleteFoodItem = async (item) => {
        if (!window.confirm(`Are you sure you want to delete ${item.foodName}?`)) return;
    
        try {
            const date = formatDate(selectedDate);
            const docRef = doc(db, 'FoodLog', date);
            const docSnap = await getDoc(docRef);
    
            if (!docSnap.exists()) {
                alert("Food log does not exist.");
                return;
            }
    
            const data = docSnap.data();
            const updatedItems = data.items.filter((i) => i.foodName !== item.foodName);
    

            const updatedMacros = {
                total_calories: Math.max(0, (data.macros?.total_calories || 0) - item.calories),
                total_carbs: Math.max(0, (data.macros?.total_carbs || 0) - item.carbs),
                total_fats: Math.max(0, (data.macros?.total_fats || 0) - item.fats),
                total_protein: Math.max(0, (data.macros?.total_protein || 0) - item.protein),
                total_sodium: Math.max(0, (data.macros?.total_sodium || 0) - item.sodium),
                total_sugar: Math.max(0, (data.macros?.total_sugar || 0) - item.sugar),
            };
    
            await updateDoc(docRef, {
                items: updatedItems,
                macros: updatedMacros
            });
    
            setFoodItems(updatedItems);
            alert(`${item.foodName} has been deleted.`);
        } catch (err) {
            console.error("Error deleting item: ", err);
            alert("Failed to delete item.");
        }
    };
    

    // Group food items by meal type
    const groupedItems = foodItems.reduce((acc, item) => {
        if (!acc[item.mealType]) {
            acc[item.mealType] = [];
        }
        acc[item.mealType].push(item);
        return acc;
    }, {});

    const isToday = (date) => {
        const today = new Date();
        return formatDate(date) === formatDate(today);
    };
    

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button 
                    className={`btn btn-outline-primary ${styles}`} 
                    onClick={() => changeDate(-1)}
                >
                    ←
                </button>
                <h3 className={` ${styles.title1}`}>
                    {isToday(selectedDate) ? "Today's Food Log" : `${formatDate(selectedDate)} Food Log`}
                </h3>
                <button 
                    className={`btn btn-outline-primary ${styles.D}`} 
                    onClick={() => changeDate(1)}
                    disabled={isToday(selectedDate)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-forward-fill" viewBox="0 0 16 16">
  <path d="m9.77 12.11 4.012-2.953a.647.647 0 0 0 0-1.114L9.771 5.09a.644.644 0 0 0-.971.557V6.65H2v3.9h6.8v1.003c0 .505.545.808.97.557"/>
</svg>
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {foodItems.length === 0 && !loading && (
                <p style={{color:'white'}}>No food log found for {formatDate(selectedDate)}.</p>
            )}


            {Object.keys(groupedItems).map((mealType) => (
    <div className={`card mb-3 ${styles.title}`} key={mealType}>
        <div className={`card-header ${styles.H}`}>
            <h4>{mealType.toUpperCase()}</h4>
        </div>
        

        <div className="card-body" style={{ 
            maxHeight: '400px',  
            overflowY: 'auto'   
        }}>
            {groupedItems[mealType].map((item, index) => (
                <div key={index} className="mb-3">
                    <div className={`card ${styles.cc}`}>
                        <div className="d-flex flex-row">
                            {item.imageUrl && (
                                <img 
                                    src={item.imageUrl} 
                                    className="card-img-left img-fluid" 
                                    alt={item.foodName} 
                                    style={{ width: "150px", objectFit: "cover" }} 
                                />
                            )}
                            <div className="col">
                                <div className="card-body">
                                    <h5 className={`card-title ${styles.T}`}>{item.foodName}</h5>
                                    
                                   
                                    <div className="row mt-4">
                                        {/* Row 1 */}
                                        <div className="col-4">
                                            <div className="card bg-light">
                                                <div className= {`card-header ${styles.B}`}>Calories</div>
                                                <div className={`card-body text-secondary ${styles.C}`}>{item.calories}</div>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="card bg-light">
                                                <div className={`card-header ${styles.B}`}>Serving</div>
                                                <div className={`card-body text-secondary ${styles.C}`}>{item.serving}</div>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="card bg-light">
                                                <div className={`card-header ${styles.B}`}>Sugar</div>
                                                <div className={`card-body text-secondary ${styles.C}`}>
                                                    {Number(item.sugar).toFixed(12).replace(/\.?0+$/, '')}g
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                            <div className="row mt-2">
                                                {/* Row 2 */}
                                                <div className="col-4">
                                                <div className="card bg-light">
                                                    <div className={`card-header ${styles.B}`}>Fats</div>
                                                    <div className={`card-body text-secondary ${styles.C}`}>
                                                        {Number(item.fats).toFixed(12).replace(/\.?0+$/, '')}g
                                                    </div>
                                                </div>
                                            </div>
                                                <div className="col-4">
                                                    <div className="card bg-light">
                                                        <div className={`card-header ${styles.B}`}>Protein</div>
                                                        <div className={`card-body text-secondary ${styles.C}`}>{item.protein}g</div>
                                                    </div>
                                                </div>
                                                <div className="col-4">
                                                    <div className="card bg-light">
                                                        <div className={`card-header ${styles.B}`}>Sodium</div>
                                                        <div className={`card-body text-secondary ${styles.C}`} >{item.sodium}mg</div>
                                                    </div>
                                                </div>
                                            </div>
                                    <button 
                                        className="btn btn-danger mt-3" 
                                        style={{ width: "100%"}}
                                        onClick={() => deleteFoodItem(item)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
))}

        </div>
    );
}

export default FoodCard;

