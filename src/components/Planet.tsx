// Planet.tsx

import React, { useRef, useEffect, useState, useCallback } from 'react';
import './ApollonianGasket.css';
import * as settings from './SimulationSettings'
import { CircleData, GasketProps } from './types'

// Importujemy nowe hooki
import { SurfaceArc, useGasketSetup, findTwoCircleState, TwoCircleState } from './useGasketSetup';
import { useSphSimulation } from './useSphSimulation';
import { useMouseHandler } from './useMouseHandler';
import { useCanvasDrawing } from './useCanvasDrawing';

let sliceHoles: CircleData[] = [];

type IntersectedArc = {
    arc: SurfaceArc;
    angle: number;
};
type Point = {
    x: number;
    y: number;
};

const TWO_PI = 2*Math.PI;

function rotatePointAroundCircle (x:number, y:number, rt:number, centreCircle:CircleData): Point {    
    const clickXCentered = x - centreCircle.x;
    const clickYCentered = y - centreCircle.y;

    const reverseRotation = rt+TWO_PI;         
    const rotatedX = clickXCentered * Math.cos(reverseRotation) - clickYCentered * Math.sin(reverseRotation);
    const rotatedY = clickXCentered * Math.sin(reverseRotation) + clickYCentered * Math.cos(reverseRotation);
    return { x:rotatedX + centreCircle.x, y:rotatedY + centreCircle.y };
};

const Planet: React.FC<GasketProps> = ({ positionX, positionY, size }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const [rotation, setRotation] = useState(0);
    const rotationRef = useRef(0); 

    // Użycie Hooka do Konfiguracji Fraktala
    const { gasketArcs, planetData } = useGasketSetup(size);

    // Użycie Hooka do Obsługi Myszki
    const onSliceArcs = useCallback((slicer: CircleData) => {
        if (slicer.r <= 0 || !canvasRef.current) return;

        let rotatedSlicerPos = rotatePointAroundCircle (slicer.x, slicer.y, -rotationRef.current, planetData);
        //let rotatedSlicerPos = { x: slicer.x, y:slicer.y}
        const rotatedSlicer: CircleData = { x: rotatedSlicerPos.x, y: rotatedSlicerPos.y, r: slicer.r };
        sliceHoles.push( rotatedSlicer );

        let intersectedArcs: IntersectedArc[] = [];
        let modifiedSurface = false;

        for (let i=0; i<gasketArcs.length; i++) {
            let a = gasketArcs[i];
            
            let overlapState = findTwoCircleState(a,slicer);

            if (overlapState == TwoCircleState.Intersecting) {
                intersectedArcs.push( { arc:a, angle:Math.atan2(a.y-slicer.y, a.x-slicer.x) } );
                modifiedSurface = modifiedSurface || a.surface;
            }
            else if (overlapState == TwoCircleState.FirstInsideSecond) {
                a.disable();
            }
        }

        intersectedArcs.sort((a,b) => b.angle-a.angle);
        
        for (let i=0; i<intersectedArcs.length; i++) {
            let a = intersectedArcs[i].arc;
            let newArc = a.slice(slicer, i>0?intersectedArcs[i-1].arc:null,i<intersectedArcs.length-1?intersectedArcs[i+1].arc:null);
            if (newArc != null) {
                gasketArcs.push(newArc);
                newArc.surface = modifiedSurface;
            }
            if (modifiedSurface) a.propagateSurface(true);
        }

    }, []);

    const { mouseData, clickCircle, isMousePressed } = useMouseHandler(canvasRef, true, onSliceArcs); 

    // Użycie Hooka do Symulacji SPH
    const { particles, sphLoop } = useSphSimulation({ size, planetData, collisionSurface:gasketArcs });

    // Użycie Hooka do Rysowania
    useCanvasDrawing(canvasRef, size, rotation, particles, gasketArcs, planetData, clickCircle, sliceHoles);


    // --- 6. GŁÓWNA PĘTLA ANIMACJI (Planeta + SPH) ---
    const mainLoop = useCallback(() => {
        
        let prevRotation = rotationRef.current;
        let newRotation = (rotationRef.current + settings.ROTATION_SPEED * settings.DELTA_TIME) % TWO_PI;

        setRotation(newRotation);
        rotationRef.current = newRotation;
        
        if (isMousePressed.current) {
            const remainingDistance = settings.MAX_SLICE_CIRCLE_SIZE - clickCircle.current.r;
            const deltaR = remainingDistance * settings.GROW_RATE_FACTOR * settings.DELTA_TIME;
            
            if (remainingDistance > 0.001) clickCircle.current.r += deltaR;
            else clickCircle.current.r = settings.MAX_SLICE_CIRCLE_SIZE; // Ustaw dokładnie na maksimum
        }

        gasketArcs.forEach( (g) => {
            let deltaRt = newRotation-prevRotation;
            let rtPos = rotatePointAroundCircle (g.x, g.y, deltaRt, planetData);
            g.angleStart += deltaRt;
            g.x = rtPos.x; g.y = rtPos.y;
        });
        
        // let mousePosRotated = rotatePointAroundPlanet (mouseData.px, mouseData.py, rotationRef.current, planetData);
        // let mouseVelRotated = rotatePointAroundPlanet (mouseData.vx, mouseData.vy, rotationRef.current, {x:mousePosRotated.x,y:mousePosRotated.y,r:1});
        sphLoop( mouseData );
        
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