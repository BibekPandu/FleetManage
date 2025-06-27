import React from 'react';
import './Card.css';

const Card = ({ title, value, children }) => {
  return (
    <div className="card">
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {value && <p className="card-value">{value}</p>}
        {children}
      </div>
    </div>
  );
};

export default Card;
