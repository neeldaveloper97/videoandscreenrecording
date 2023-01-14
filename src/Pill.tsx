import React from "react";

interface IPill {
  title: string;
  value: string;
  style?: any;
}

const Pill: React.FC<IPill> = ({ title, value, style }) => {
  return (
    <div style={style} className="pill">
      <h6>{title}</h6>
      <p>{value}</p>
    </div>
  );
};

export default Pill;
