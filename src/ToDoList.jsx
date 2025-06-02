import React, { useState, useEffect } from 'react';


const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = window.innerWidth < 600 ? 30 : 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: `rgba(59, 130, 246, ${Math.random() * 0.4 + 0.1})`
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${1 - distance/150})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Boundary check
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();

    return () => cancelAnimationFrame(animate);
  }, []);

  const taskChange = (e) => setInputValue(e.target.value);

  const addTask = () => {
    if (inputValue.trim() === '') {
      alert('Please enter a task');
      return;
    }
    setTasks([...tasks, inputValue]);
    setInputValue('');
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const moveTaskUp = (index) => {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index-1], updatedTasks[index]] = [updatedTasks[index], updatedTasks[index-1]];
      setTasks(updatedTasks);
    }
  };

  const moveTaskDown = (index) => {
    if (index < tasks.length-1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index+1], updatedTasks[index]] = [updatedTasks[index], updatedTasks[index+1]];
      setTasks(updatedTasks);
    }
  };

  return (
    <div className="todo-app">
      {/* Particle Canvas Background */}
      <canvas 
        id="particle-canvas" 
        className="particle-canvas"
      ></canvas>

      <div className="Todocontainer">
        <h1 className="heading">To Do List</h1>
        <div className="input-container">
          <input 
            value={inputValue} 
            onChange={taskChange} 
            type="text" 
            placeholder="Enter Task"
          />
          <button onClick={addTask} className="addbtn">Add Task</button>
        </div>
        <div className="List-component">
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>
                <span className="task-text">{task}</span>
                <div className="task-actions">
                  <button onClick={() => moveTaskUp(index)} className="moveup">👆</button>
                  <button onClick={() => moveTaskDown(index)} className="movedown">👇</button>
                  <button onClick={() => removeTask(index)} className="delete">❌</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoList;