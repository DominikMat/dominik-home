// useMouseHandler.ts

import { useRef, useEffect, RefObject, useState, useCallback } from 'react';
import * as settings from './SimulationSettings'; 
import { MouseData, MouseRefs} from './types'

// Zmieniamy logikę w hooku:
export const useMouseHandler = (canvasRef: RefObject<HTMLCanvasElement | null>, isRunning: boolean): MouseRefs => {
    // Istniejące Stany (do symulacji SPH)
    const mousePosRef = useRef({ x: 0, y: 0 });
    const mouseVelRef = useRef({ vx: 0, vy: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isRunning) {
            return; 
        }

        const DELTA_TIME_INV = 1 / settings.DELTA_TIME; 
        const updateMouseData = (mouseX: number, mouseY: number) => {
            const prevX = mousePosRef.current.x;
            const prevY = mousePosRef.current.y;
            mouseVelRef.current.vx = (mouseX - prevX) * DELTA_TIME_INV * 0.01; 
            mouseVelRef.current.vy = (mouseY - prevY) * DELTA_TIME_INV * 0.01;
            mousePosRef.current.x = mouseX;
            mousePosRef.current.y = mouseY;
        };
        


        // 2. OBSŁUGA RUCHU (nadal potrzebna do aktualizacji mouseData dla SPH)
        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            updateMouseData(mouseX, mouseY); // Nadal aktualizuj dane dla SPH!
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [canvasRef, isRunning]);

    return { 
        mouseData: {
            vx: mouseVelRef.current.vx,
            vy: mouseVelRef.current.vy,
            px: mousePosRef.current.x,
            py: mousePosRef.current.y,
        },
    };
};