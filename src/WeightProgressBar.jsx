// WeightProgressBar.jsx
import React from 'react';
import styles from './WeightProgressBar.module.css';

const WeightProgressBar = ({ currentValue, startValue, goalValue, title, unit }) => {
  // Calculate progress percentage
  const calculateProgress = () => {
    // If values are not valid numbers, return 0
    if (!currentValue || !startValue || !goalValue) return 0;

    // Calculate the total distance between start and goal
    const totalDistance = Math.abs(goalValue - startValue);
    
    // Calculate how far we've come from the start
    const progressDistance = Math.abs(currentValue - startValue);
    
    // Calculate percentage
    const percentage = (progressDistance / totalDistance) * 100;

    // Return the percentage, ensuring it's between 0 and no upper limit
    return Math.max(0, percentage);
  };

  const progressPercentage = calculateProgress();
  


  
  // Determine if we've exceeded or reached the goal
  const isOverGoal = goalValue > startValue 
    ? currentValue > goalValue 
    : currentValue < goalValue;

  // For debugging
  console.log({
    currentValue,
    startValue,
    goalValue,
    progressPercentage,
    isOverGoal
  });

  return (
    <div className="card mt-1">
      <div className="card-body">
        <h5 className={`card-header ${styles.T}`}>{title}</h5>
        <div className="d-flex justify-content-between mb-2">
          <span className={styles.B}>Start: {startValue?.toFixed(1)}{unit}</span>
          <span>Current: {currentValue?.toFixed(1)}{unit}</span>
          <span>Goal: {goalValue?.toFixed(1)}{unit}</span>
        </div>
        <div className="progress" style={{ height: "25px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${Math.min(progressPercentage, 100)}%`,
              backgroundColor: isOverGoal ? '#dc3545' : '#28a745'
            }}
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {Math.round(progressPercentage)}%
          </div>
        </div>
        {isOverGoal && (
          <div className="text-danger mt-2">
            {goalValue > startValue 
              ? `Exceeded goal by ${(currentValue - goalValue).toFixed(1)}${unit}`
              : `Surpassed goal by ${(goalValue - currentValue).toFixed(1)}${unit}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightProgressBar;
