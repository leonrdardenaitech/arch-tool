import React, { createContext, useContext, useState, useEffect } from 'react';
import wavioEngine from '../utils/sonarEngine';

const WavioContext = createContext();

export const WavioProvider = ({ children }) => {
  const [isEcoMode, setIsEcoMode] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isSonarActive, setIsSonarActive] = useState(false);
  const [globalTheme, setGlobalTheme] = useState('Amazingly_Beautiful_3D_Aquarium_Live_Wallpaper_Wallpaper.mp4');
  const [isInitializing, setIsInitializing] = useState(true); // Control the big green pulse

  useEffect(() => {
    // Initial Pulse Timeout: Show the "Green Core" then return to standby
    const timer = setTimeout(() => setIsInitializing(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(batt => {
        setBatteryLevel(batt.level * 100);
        const updateBattery = () => {
          const level = batt.level * 100;
          setBatteryLevel(level);
          if (level <= 20 && !isEcoMode) {
            setIsEcoMode(true);
            setGlobalTheme('placidplace-fish-13525.gif');
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
    setGlobalTheme(newMode ? 'placidplace-fish-13525.gif' : 'Amazingly_Beautiful_3D_Aquarium_Live_Wallpaper_Wallpaper.mp4');
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
      isEcoMode, toggleEcoMode, batteryLevel, 
      isSonarActive, toggleSonar, 
      globalTheme, setGlobalTheme,
      isInitializing, setIsInitializing
    }}>
      {children}
    </WavioContext.Provider>
  );
};

export const useWavio = () => useContext(WavioContext);
