// useMouseHandler.ts

import { useRef, useEffect, RefObject } from 'react';
import { CircleData, MouseRefs} from './types'

// Zmieniamy logikę w hooku:
export const useMouseHandler = (
    canvasRef: RefObject<HTMLCanvasElement | null>, 
    isRunning: boolean,
    onMouseRelease: (c: CircleData) => void
): MouseRefs => {

    // Istniejące Stany (do symulacji SPH)
    const mousePosRef = useRef({ x: 0, y: 0 });
    const mouseVelRef = useRef({ x: 0, y: 0 });

    const clickCircle = useRef<CircleData>({ x: 0, y: 0, r: 0 });
    const isMousePressed = useRef(false); // Ref zamiast lokalnej let

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isRunning) {
            return; 
        }

        const updateMouseData = (mouseX: number, mouseY: number) => {
            const prevX = mousePosRef.current.x;
            const prevY = mousePosRef.current.y;
            mouseVelRef.current.x = (mouseX - prevX);
            mouseVelRef.current.y = (mouseY - prevY);
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

        canvas.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        
        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [canvasRef, isRunning]);

    return { 
        // mouseData: {
        //     vx: mouseVelRef.current.vx,
        //     vy: mouseVelRef.current.vy,
        //     px: mousePosRef.current.x,
        //     py: mousePosRef.current.y,
        // },
        mousePosRef,
        mouseVelRef,
        isMousePressed,
        clickCircle
    };
};