
import React from 'react';
import styles from './WeightProgressBar.module.css';

const WeightProgressBar = ({ currentValue, startValue, goalValue, title, unit }) => {

  const calculateProgress = () => {

    if (!currentValue || !startValue || !goalValue) return 0;


    const totalDistance = Math.abs(goalValue - startValue);
    

    const progressDistance = Math.abs(currentValue - startValue);
    

    const percentage = (progressDistance / totalDistance) * 100;


    return Math.max(0, percentage);
  };

  const progressPercentage = calculateProgress();
  


  

  const isOverGoal = goalValue > startValue 
    ? currentValue > goalValue 
    : currentValue < goalValue;


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
