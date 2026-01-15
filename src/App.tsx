import React, { useEffect, useRef, useState, useCallback } from 'react';
import { HashRouter } from 'react-router-dom';
import Navigation from './Navigation';
import PlanetSimulation from './planet-sim/Planet';
import * as planetSimulationSettings from './planet-sim/SimulationSettings';
import { Hash } from 'crypto';
import { transform } from 'typescript';

function App() {
  const [sphEnabled] = useState<boolean>(() => {
    // 1. Safety check for SSR (Server Side Rendering) or weird environments
    if (typeof navigator === 'undefined') return false; 

    // 2. User Agent Check
    const ua = navigator.userAgent || '';
    const isMobile =
      /Mobi|Android|iPhone|iPad|iPod|Windows Phone/.test(ua) ||
      ('ontouchstart' in window && (navigator.maxTouchPoints || 0) > 0);

    // 3. Hardware Checks
    const nav = navigator as any;
    const hw = nav.hardwareConcurrency; 
    const mem = nav.deviceMemory; // Note: Returns undefined on Firefox/Safari
    const connection = nav.connection;
    const saveData = connection ? connection.saveData : false;
    const effectiveType = connection ? connection.effectiveType : '';
    const slowNetwork = effectiveType && /(2g|3g)/.test(effectiveType);

    // 4. The Decision Logic
    const canEnable = !isMobile && (!hw || hw >= 4) && (!mem || mem >= 4) && !saveData && !slowNetwork;
    console.log(`SPH Init: Mobile=${isMobile}, HW=${hw}, Mem=${mem}, Enabled=${canEnable}`);
    
    return canEnable;
  });

  const [simVersion, setSimVersion] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleReset = () => {
    setSimVersion(v => v + 1);
    setHasInteracted(false);
  };
  const handleInteraction = useCallback(() => {
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  return (
    <div className="App">
      <HashRouter>
        <Navigation/>
      </HashRouter>

      <PlanetSimulation key={simVersion}
        size={planetSimulationSettings.CANVAS_SIDE_LEN}
        positionX="25vw"
        positionY="0vh"
        sphEnabled={sphEnabled}
        onInteraction={handleInteraction}
      />

      <div style={{
        position: 'absolute',
        left: `calc(25vw + ${planetSimulationSettings.CANVAS_SIDE_LEN / 2}px)`,
        top: `calc(${planetSimulationSettings.CANVAS_SIDE_LEN * 0.42}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        textAlign:'center',
      }}> 
        {/* CONDITIONAL RENDERING */}
        {!hasInteracted ? (
          <p style={{
            color: '#ffffff7c',
            fontSize: '1.25ch',
            pointerEvents: 'none',
            opacity: 0.8,
            transition: 'opacity 0.3s'
          }}> 
            Click the planet! 
          </p>
        ) : (
          <button 
            onClick={handleReset}
            style={{
              background: 'rgba(0,0,0,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.3)',
              padding: '6px 12px',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { 
              e.currentTarget.style.borderColor = '#fff';
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
            }}
          > 
            Reset Planet 
          </button>
        )}
      </div>
    </div>
  );
}

export default App;