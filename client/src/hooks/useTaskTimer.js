/**
 * TASK TIMER HOOK
 * Manages task time tracking for technicians
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export const useTaskTimer = (initialTimeSpent = 0) => {
  const [timeSpent, setTimeSpent] = useState(initialTimeSpent);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedDuration, setPausedDuration] = useState(0);
  const startTimeRef = useRef(null);
  const pauseStartTimeRef = useRef(null);
  const intervalRef = useRef(null);

  /**
   * Start timer
   */
  const startTimer = useCallback(() => {
    if (isRunning || isPaused) return;
    
    startTimeRef.current = Date.now() - (timeSpent * 1000);
    setIsRunning(true);
    setIsPaused(false);
    
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeSpent(elapsed);
      }
    }, 1000);
  }, [isRunning, isPaused, timeSpent]);

  /**
   * Pause timer
   */
  const pauseTimer = useCallback(() => {
    if (!isRunning || isPaused) return;
    
    pauseStartTimeRef.current = Date.now();
    setIsPaused(true);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning, isPaused]);

  /**
   * Resume timer
   */
  const resumeTimer = useCallback(() => {
    if (!isRunning || !isPaused) return;
    
    if (pauseStartTimeRef.current) {
      const pausedMillis = Date.now() - pauseStartTimeRef.current;
      setPausedDuration(prev => prev + pausedMillis);
      startTimeRef.current = Date.now() - (timeSpent * 1000);
      pauseStartTimeRef.current = null;
    }
    
    setIsPaused(false);
    
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeSpent(elapsed);
      }
    }, 1000);
  }, [isRunning, isPaused, timeSpent]);

  /**
   * Stop timer
   */
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
    startTimeRef.current = null;
    pauseStartTimeRef.current = null;
  }, []);

  /**
   * Reset timer
   */
  const resetTimer = useCallback(() => {
    stopTimer();
    setTimeSpent(0);
    setPausedDuration(0);
  }, [stopTimer]);

  /**
   * Format time as HH:MM:SS
   */
  const formatTime = useCallback((seconds = timeSpent) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timeSpent]);

  /**
   * Get time spent in minutes
   */
  const getMinutesSpent = useCallback(() => {
    return Math.floor(timeSpent / 60);
  }, [timeSpent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeSpent,
    isRunning,
    isPaused,
    pausedDuration,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    formatTime,
    getMinutesSpent
  };
};