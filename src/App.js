import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [gridSize, setGridSize] = useState({ rows: 20, columns: 30 });
  const [drops, setDrops] = useState([]);
  const [color, setColor] = useState("magenta");  

  useEffect(() => {
     
    const initialDrops = Array(gridSize.columns).fill(0).map(() => ({
      position: Math.floor(Math.random() * gridSize.rows),
      trail: [],
    }));
    setDrops(initialDrops);

    
    const positionInterval = setInterval(() => {
      setDrops((prevDrops) =>
        prevDrops.map((drop) => {
          const newTrail = [drop.position, ...drop.trail.slice(0, 4)];  
          return {
            position: (drop.position + 1) % gridSize.rows,
            trail: newTrail,
          };
        })
      );
    }, 150);

     
    const colorInterval = setInterval(() => {
      setColor(getRandomColor());
    }, 5000);

    return () => {
      clearInterval(positionInterval);
      clearInterval(colorInterval);
    };
  }, [gridSize]);

  
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const adjustBrightness = (hexColor, percent) => {
    const num = parseInt(hexColor.slice(1), 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00ff) + percent;
    let b = (num & 0x0000ff) + percent;

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `rgb(${r},${g},${b})`;
  };

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.columns; col++) {
        const drop = drops[col];
        let isActive = false;
        let opacity = 0;
        let backgroundColor = "#222";
        let boxShadow = "none";

        if (drop) {
          if (drop.position === row) {
            isActive = true;  
            backgroundColor = adjustBrightness(color, 50);  
            boxShadow = `0 0 15px ${adjustBrightness(color, 100)}, 0 0 30px ${adjustBrightness(
              color,
              100
            )}`;
          } else {
            const trailIndex = drop.trail.indexOf(row);
            if (trailIndex !== -1) {
              opacity = 1 - trailIndex * 0.25;  
              backgroundColor = color;
            }
          }
        }

        grid.push(
          <div
            key={`${row}-${col}`}
            className={`cell ${isActive ? "active" : ""}`}
            style={{
              backgroundColor: isActive || opacity > 0 ? backgroundColor : "#222",
              opacity: isActive ? 1 : opacity,  
              boxShadow: isActive ? boxShadow : "none",  
            }}
          ></div>
        );
      }
    }
    return grid;
  };

  return (
    <div className="app">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize.columns}, 1fr)`,
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
};

export default App;
