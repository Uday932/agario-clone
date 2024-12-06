import React, { useEffect, useRef, useState } from 'react';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({ x: 100, y: 100, radius: 20, color: '#3498db' });
  const [targetPos, setTargetPos] = useState({ x: 100, y: 100 });
  const [foodItems, setFoodItems] = useState([]);
  const socket = useRef(null);

  useEffect(() => {

    const generateFood = () => {
      const newFoodItems = [];
      for (let i = 0; i < 10; i++) { 
        newFoodItems.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        });
      }
      setFoodItems(newFoodItems);
    };

    generateFood();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height); 

      foodItems.forEach((food) => {
        context.beginPath();
        context.arc(food.x, food.y, 5, 0, Math.PI * 2); 
        context.fillStyle = 'yellow';
        context.fill();
        context.closePath();
      });

      context.beginPath();
      context.arc(player.x, player.y, player.radius, 0, Math.PI * 2); 
      context.fillStyle = player.color;
      context.fill();
      context.closePath();

      player.x += (targetPos.x - player.x) * 0.1; 
      player.y += (targetPos.y - player.y) * 0.1;

      requestAnimationFrame(animate); 
    };

    animate();
  }, [player, foodItems]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTargetPos({ x: mouseX, y: mouseY });
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      style={{ display: 'block', background: '#f0f0f0' }}
    />
  );
};

export default GameCanvas;

