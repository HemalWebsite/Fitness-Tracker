

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function CustomLineChart({ yAxisMin, yAxisMax, height = 300, dataKey = "weight" }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dailyLogRef = collection(db, 'DailyLog');
      const querySnapshot = await getDocs(dailyLogRef);
      
      const logs = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data.date && data[dataKey] !== undefined) {
          logs.push({ name: data.date, value: data[dataKey] });
        }
      });

      // Sort logs by date
      logs.sort((a, b) => new Date(a.name) - new Date(b.name));

      // Filter logs at 5-day intervals
      const filteredLogs = logs.filter((_, index) => index % 5 === 0);

      setChartData(filteredLogs);
    };

    fetchData();
  }, [dataKey]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
        <YAxis domain={[yAxisMin, yAxisMax]} />
        <Tooltip formatter={(value) => Number(value).toFixed(1)} />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default CustomLineChart;
