import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SchedulesBarChart = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background-primary)',
              borderColor: 'var(--border-color)',
            }}
          />
          <Legend />
          <Bar dataKey="tasks" fill="var(--accent-primary)" name="Scheduled Tasks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SchedulesBarChart; 