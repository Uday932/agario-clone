import React, { useEffect, useRef, useState } from 'react';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({ x: 100, y: 100, radius: 20, color: '#3498db' });
  const [foodItems, setFoodItems] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

     
      foodItems.forEach((food, index) => {
        context.beginPath();
        context.arc(food.x, food.y, 5, 0, Math.PI * 2); 
        context.fillStyle = 'yellow';
        context.fill();
        context.closePath();

       
        const dx = food.x - player.x;
        const dy = food.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius + 5) { 
        
          setPlayer((prev) => ({
            ...prev,
            radius: prev.radius + 1, 
          }));

          setFoodItems((prev) => prev.filter((_, i) => i !== index));
        }
      });

      
      context.beginPath();
      context.arc(player.x, player.y, player.radius, 0, Math.PI * 2); 
      context.fillStyle = player.color;
      context.fill();
      context.closePath();

     
      const dx = mousePosition.x - player.x;
      const dy = mousePosition.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 0.5; 

      if (distance > 1) { 
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;
        setPlayer((prev) => ({
          ...prev,
          x: prev.x + moveX,
          y: prev.y + moveY,
        }));
      }

      requestAnimationFrame(animate); 
    };

    animate();
  }, [player, foodItems, mousePosition]);

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', background: '#f0f0f0' }}
    />
  );
};

export default GameCanvas;