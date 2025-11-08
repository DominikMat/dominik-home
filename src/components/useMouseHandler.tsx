// useMouseHandler.ts

import { useRef, useEffect, RefObject, useState, useCallback } from 'react';
import * as settings from './SimulationSettings'; 
import { CircleData, MouseData, MouseRefs} from './types'
import { click } from '@testing-library/user-event/dist/click';

// Zmieniamy logikę w hooku:
export const useMouseHandler = (
    canvasRef: RefObject<HTMLCanvasElement | null>, 
    isRunning: boolean,
    onMouseRelease: (c: CircleData) => void
): MouseRefs => {

    // Istniejące Stany (do symulacji SPH)
    const mousePosRef = useRef({ x: 0, y: 0 });
    const mouseVelRef = useRef({ vx: 0, vy: 0 });

    const clickCircle = useRef<CircleData>({ x: 0, y: 0, r: 0 });
    const isMousePressed = useRef(false); // Ref zamiast lokalnej let

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

            updateMouseData(mouseX, mouseY);
        };

        canvas.addEventListener('mousemove', handleMouseMove);

        
        const onMouseDown = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const canvasMouseX = event.clientX - rect.left;
            const canvasMouseY = event.clientY - rect.top;

            if (canvasMouseX >= 0 && canvasMouseX <=rect.width && canvasMouseY >= 0 && canvasMouseY <= rect.height){
                isMousePressed.current = true;
                clickCircle.current.x = mousePosRef.current.x;
                clickCircle.current.y = mousePosRef.current.y;
                clickCircle.current.r = 1;
            }
        };
        const onMouseUp = (event: MouseEvent) => {
            if (isMousePressed.current) {
                isMousePressed.current = false;
                onMouseRelease(clickCircle.current);
                clickCircle.current.x = 0;
                clickCircle.current.y = 0;
                clickCircle.current.r = 0;
            }
        };

        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        
        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [canvasRef, isRunning]);

    return { 
        mouseData: {
            vx: mouseVelRef.current.vx,
            vy: mouseVelRef.current.vy,
            px: mousePosRef.current.x,
            py: mousePosRef.current.y,
        },
        isMousePressed,
        clickCircle
    };
};