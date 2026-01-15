// Planet.tsx

import React, { useRef, useEffect, useState, useCallback, use } from 'react';
import './ApollonianGasket.css';
import * as settings from './SimulationSettings'
import { CircleData, GasketProps, MouseData } from './types'

// Importujemy nowe hooki
import { SurfaceArc, useGasketSetup, findTwoCircleState, TwoCircleState } from './useGasketSetup';
import { useSphSimulation } from './useSphSimulation';
import { useMouseHandler } from './useMouseHandler';
import { useCanvasDrawing } from './useCanvasDrawing';

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

const Planet: React.FC<GasketProps> = ({ positionX, positionY, size, particleNum, onInteraction }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const [sliceHoles, setSliceHoles] = useState<CircleData[]>([]);
    const rotationRef = useRef(0); 

    const lastTimeRef = useRef(0);
    const physicsAccRef = useRef(0);
    const renderAccRef = useRef(0);

    const sphEnabled = particleNum != 0

    // Użycie Hooka do Konfiguracji Fraktala
    const { gasketArcs, planetData } = useGasketSetup(size);

    // Użycie Hooka do Obsługi Myszki
    const onSliceArcs = useCallback((slicer: CircleData) => {
        if (slicer.r <= 0 || !canvasRef.current) return;

        if (onInteraction) onInteraction();

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

    }, [gasketArcs, planetData]);

    const { mousePosRef, mouseVelRef, clickCircle, isMousePressed } = useMouseHandler(canvasRef, true, onSliceArcs); 

    // Użycie Hooka do Symulacji SPH
    const { particlesRef, sphLoop } = useSphSimulation({ size, planetData, collisionSurface:gasketArcs, particleNum });

    // Użycie Hooka do Rysowania
    const { drawAll:canvasRender } = useCanvasDrawing(size, gasketArcs, planetData, clickCircle, sliceHoles, sphEnabled);


    // --- 6. GŁÓWNA PĘTLA ANIMACJI (Planeta + SPH) ---
    const runSimulationStep = useCallback(() => {
        let prevRotation = rotationRef.current;
        let newRotation = (rotationRef.current + settings.ROTATION_SPEED * settings.SIMULATION_DELTA_TIME) % TWO_PI;
        rotationRef.current = newRotation;
        
        if (isMousePressed.current) {
            const remainingDistance = settings.MAX_SLICE_CIRCLE_SIZE - clickCircle.current.r;
            const deltaR = remainingDistance * settings.GROW_RATE_FACTOR * settings.SIMULATION_DELTA_TIME;
            
            if (remainingDistance > 0.001) clickCircle.current.r += deltaR;
            else clickCircle.current.r = settings.MAX_SLICE_CIRCLE_SIZE; // Ustaw dokładnie na maksimum
        }

        gasketArcs.forEach( (g) => {
            let deltaRt = newRotation-prevRotation;
            let rtPos = rotatePointAroundCircle (g.x, g.y, deltaRt, planetData);
            g.angleStart += deltaRt;
            g.x = rtPos.x; g.y = rtPos.y;
        });
        
        const currentMouseData: MouseData = {
            px: mousePosRef.current.x, py: mousePosRef.current.y,
            vx: mouseVelRef.current.x, vy: mouseVelRef.current.y
        }

        if (sphEnabled) sphLoop( currentMouseData );        

    }, [sphLoop, particlesRef, planetData, gasketArcs, isMousePressed, clickCircle, mousePosRef, mouseVelRef]);

    const mainLoop = useCallback( (currentTime: number) => {
        if (lastTimeRef.current === 0) {
            lastTimeRef.current = currentTime;
            animationRef.current = requestAnimationFrame(mainLoop);
            return;
        }

        let deltaTime = (currentTime - lastTimeRef.current) / 1000.0;
        //console.log("CURRENT FPS: " + (1/deltaTime)); always 60 ???
        lastTimeRef.current = currentTime;
        if (deltaTime > 0.1) deltaTime = 0.1;

        physicsAccRef.current += deltaTime;
        while (physicsAccRef.current >= settings.SIMULATION_DELTA_TIME) {
            runSimulationStep(); // Uruchom jeden krok symulacji
            physicsAccRef.current -= settings.SIMULATION_DELTA_TIME;
        }

        renderAccRef.current += deltaTime;
        if (renderAccRef.current >= settings.CANVAS_DELTA_TIME) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx) canvasRender(ctx, rotationRef.current, particlesRef)
            renderAccRef.current %= settings.CANVAS_DELTA_TIME;
        }

        animationRef.current = requestAnimationFrame(mainLoop);
        
    }, [canvasRender, particlesRef, runSimulationStep]);
    // --- Render ---

    // Uruchomienie głównej pętli
    useEffect(() => {
        lastTimeRef.current = 0;
        physicsAccRef.current = 0;
        renderAccRef.current = 0;

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