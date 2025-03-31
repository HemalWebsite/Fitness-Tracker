import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const GoalRangeInput = ({ goalType, onSave }) => {
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');

  // Automatically call onSave whenever minValue or maxValue changes
  useEffect(() => {
    if (minValue !== '' && maxValue !== '') {
      onSave(goalType, minValue, maxValue);
    }
  }, [minValue, maxValue, goalType, onSave]);

  const handleMinChange = (e) => {
    setMinValue(e.target.value);
  };

  const handleMaxChange = (e) => {
    setMaxValue(e.target.value);
  };

  return (
    <Row>
      <Col md={5}>
        <Form.Control
          type="number"
          placeholder="Min"
          value={minValue}
          onChange={handleMinChange}
        />
      </Col>
      <Col md={2} className="text-center">
        <h2>x</h2>
      </Col>
      <Col md={5}>
        <Form.Control
          type="number"
          placeholder="Max"
          value={maxValue}
          onChange={handleMaxChange}
        />
      </Col>
    </Row>
  );
};

export default GoalRangeInput;
