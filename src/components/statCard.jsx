import React from 'react';
import { Card } from 'react-bootstrap';


const StatCard = ({ title, value, subtitle, percentage, chart, height }) => {
  return (
    <Card className="mb-4" style={{ marginBottom: '0px' }}> 
      <Card.Body style={{ paddingBottom: '0px' }}> 
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          <h2>{value}</h2>
          <small>{subtitle}</small>
          <div style={{ color: percentage > 0 ? 'green' : 'red' }}>
            {percentage > 0 ? `+${percentage}%` : `${percentage}%`}
          </div>
        </Card.Text>
        <div style={{ height: height || '250px', paddingBottom: '0px' }}> 
          {chart}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
