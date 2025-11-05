// Planet.tsx

import React, { useRef, useEffect, useState, useCallback } from 'react';
import './ApollonianGasket.css';
import * as settings from './SimulationSettings'
import { GasketProps } from './types'

// Importujemy nowe hooki
import { useGasketSetup } from './useGasketSetup';
import { useSphSimulation } from './useSphSimulation';
import { useMouseHandler } from './useMouseHandler';
import { useCanvasDrawing } from './useCanvasDrawing';


const Planet: React.FC<GasketProps> = ({ positionX, positionY, scale, size }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const [rotation, setRotation] = useState(0);

    // Użycie Hooka do Konfiguracji Fraktala
    const { biggestCircle, normalizeAndScale } = useGasketSetup(size, scale);

    // Użycie Hooka do Obsługi Myszki
    const { mouseData } = useMouseHandler(canvasRef, true); 

    // Użycie Hooka do Symulacji SPH
    const { particles, sphLoop } = useSphSimulation({
        size,
        biggestCircle,
        normalizeAndScale
    });

    // Użycie Hooka do Rysowania
    useCanvasDrawing(canvasRef, size, normalizeAndScale, rotation, particles);


    // --- 6. GŁÓWNA PĘTLA ANIMACJI (Planeta + SPH) ---
    const mainLoop = useCallback(() => {
        
        setRotation(prevRotation => (prevRotation + settings.ROTATION_SPEED) % (2 * Math.PI));
        sphLoop(mouseData);

        animationRef.current = requestAnimationFrame(mainLoop);
    }, [sphLoop, mouseData]);

    // Uruchomienie głównej pętli
    useEffect(() => {
        animationRef.current = requestAnimationFrame(mainLoop);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [mainLoop]);


    // --- render ---
    return (
        <canvas 
            ref={canvasRef}
            width={size}
            height={size}
            className="apollonian-gasket"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                left: positionX,
                top: positionY,
                zIndex: 100, 
            }}
        />
    );
};

export default Planet;