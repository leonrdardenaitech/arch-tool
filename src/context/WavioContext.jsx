import React, { createContext, useContext, useState, useEffect } from 'react';
import wavioEngine from '../utils/sonarEngine';

const WavioContext = createContext();

export const WavioProvider = ({ children }) => {
  const [isEcoMode, setIsEcoMode] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isSonarActive, setIsSonarActive] = useState(false);
  const [globalTheme, setGlobalTheme] = useState('aquarium-main.mp4'); // Default

  useEffect(() => {
    // Battery Monitoring
    if ('getBattery' in navigator) {
      navigator.getBattery().then(batt => {
        setBatteryLevel(batt.level * 100);
        
        const updateBattery = () => {
          const level = batt.level * 100;
          setBatteryLevel(level);
          if (level <= 20 && !isEcoMode) {
            setIsEcoMode(true);
            setGlobalTheme('placidplace-fish-13525.gif'); // Auto-switch to low power background
          }
        };

        batt.addEventListener('levelchange', updateBattery);
        return () => batt.removeEventListener('levelchange', updateBattery);
      });
    }
  }, [isEcoMode]);

  const toggleEcoMode = () => {
    const newMode = !isEcoMode;
    setIsEcoMode(newMode);
    if (newMode) {
      setGlobalTheme('placidplace-fish-13525.gif');
    } else {
      setGlobalTheme('aquarium-main.mp4');
    }
  };

  const toggleSonar = async () => {
    if (isSonarActive) {
      wavioEngine.stop();
      setIsSonarActive(false);
    } else {
      await wavioEngine.start();
      setIsSonarActive(true);
    }
  };

  return (
    <WavioContext.Provider value={{ 
      isEcoMode, 
      toggleEcoMode, 
      batteryLevel, 
      isSonarActive, 
      toggleSonar,
      globalTheme,
      setGlobalTheme
    }}>
      {children}
    </WavioContext.Provider>
  );
};

export const useWavio = () => useContext(WavioContext);
