import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './Navigation';
import PlanetSimulation from './planet-sim/Planet';
import * as planetSimulationSettings from './planet-sim/SimulationSettings';

function App() {
  let sphEnabled = useRef<boolean>(false);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const ua = navigator.userAgent || '';
    const isMobile =
      /Mobi|Android|iPhone|iPad|iPod|Windows Phone/.test(ua) ||
      ('ontouchstart' in window && (navigator.maxTouchPoints || 0) > 0);

    const hw = (navigator as any).hardwareConcurrency;
    const mem = (navigator as any).deviceMemory;
    const connection = (navigator as any).connection;
    const saveData = connection && connection.saveData;
    const effectiveType = connection && connection.effectiveType;
    const slowNetwork = effectiveType && /(2g|3g)/.test(effectiveType);

    // Enable SPH only on non-mobile devices with reasonable CPU/memory and no save-data/very-slow network.
    // console.log("Mobile: " + isMobile)
    // console.log("Hardware >=4 : " + hw)
    // console.log("memory >= 4: " + mem)
    // console.log("save data: " + saveData)
    // console.log("slow network: " + slowNetwork)
    const canEnable = !isMobile && (!hw || hw >= 4) && (!mem || mem >= 4) && !saveData && !slowNetwork;
    sphEnabled.current = canEnable;
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>

      <PlanetSimulation
        size={planetSimulationSettings.CANVAS_SIDE_LEN}
        positionX="25vw"
        positionY="0vh"
        sphEnabled={sphEnabled}
      />

      <p style={{
        position: 'absolute',
        left: '85vw',
        top: '85vh',
        fontSize: '1.34ch'
      }}> Click me! </p>
    </div>
  );
}

export default App;