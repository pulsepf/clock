import './App.css';
import React, { useState, useEffect } from 'react';
import sound from './sound.mp3';

const Clock = () => {
    const [mode, setMode] = useState('session');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [sessionDuration, setSessionDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
      const audio = new Audio(sound);
      let intervalId;
      if (isRunning) {
        intervalId = setInterval(() => {
          setTimeLeft(timeLeft => {
            if (timeLeft === 0) {
              if (mode === 'session') {
                setMode('break');
                setTimeLeft(breakDuration * 60);
              } else {
                setMode('session');
                setTimeLeft(sessionDuration * 60);
              }
              audio.play();
              return;
            }
            setTimeLeft(timeLeft - 1);
          });
        }, 1000);
      } else if (!isRunning && timeLeft !== 0) {
        clearInterval(intervalId);
      }
      return () => {
        clearInterval(intervalId);
        audio.pause();
      };
    }, [isRunning, timeLeft, mode, sessionDuration, breakDuration]);

    const startTimer = () => {
        setIsRunning(true);
    }

    const stopTimer = () => {
        setIsRunning(false);
    }

    const resetTimer = () => {
        setMode('session');
        setTimeLeft(sessionDuration * 60);
        setIsRunning(false);
    }

    const handleSessionDurationChange = (event) => {
      const value = event.target.value;
      if(value >= 1 && value <= 60) {
          setSessionDuration(value);
          setTimeLeft(value * 60);
      }
  }

  const handleBreakDurationChange = (event) => {
      const value = event.target.value;
      if(value >= 1 && value <= 60) {
          setBreakDuration(value);
      }
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
      <div id="clock">
          <div id="timer-label">{mode === 'session' ? 'Session' : 'Break'}</div>
          <div id="time-left">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>
          <div>
              <label className="duration-label">Session Duration:</label>
              <input className="duration-input" type="number" value={sessionDuration} onChange={handleSessionDurationChange} min={1} max={60}/>
          </div>
          <div>
          <label className="duration-label">Break Duration:</label>
                <input className="duration-input" type="number" value={breakDuration} onChange={handleBreakDurationChange} min={1} max={60}/>
            </div>
            <button id="start_stop" onClick={isRunning ? stopTimer : startTimer}>
                {isRunning ? 'Stop' : 'Start'}
            </button>
            <button id="reset" onClick={resetTimer}>Reset</button>
        </div>
    );
}

export default Clock;

