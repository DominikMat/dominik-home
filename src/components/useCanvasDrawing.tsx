// useCanvasDrawing.ts

import { useCallback, useEffect, RefObject } from 'react'; // Dodaj RefObject
import { AppollonianGasketCircles } from './ApollonianData';
import { ParticleState, CircleData } from './types';
import * as settings from './SimulationSettings';

// Typ dla funkcji normalizującej
type NormalizeAndScaleFunc = (x: number, y: number, r: number) => { canvasX: number; canvasY: number; canvasR: number };

export const useCanvasDrawing = (
    canvasRef: RefObject<HTMLCanvasElement | null>, 
    size: number, 
    normalizeAndScale: NormalizeAndScaleFunc,
    rotation: number, 
    particles: ParticleState[]
) => {

    // 5. RYSOWANIE NA CANVAS (Gasket + SPH)
    const drawAll = useCallback((ctx: CanvasRenderingContext2D, circles: CircleData[], currentRotation: number, currentParticles: ParticleState[]) => {

        ctx.clearRect(0, 0, size, size);

        // --- A. Rysowanie Fraktala (Planety) ---
        const center = size / 2;
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(currentRotation);
        ctx.translate(-center, -center);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = settings.BORDER_WIDTH;

        circles.forEach((circle,idx) => {
            //if(idx > 50) return;
            const { canvasX, canvasY, canvasR } = normalizeAndScale(circle.x, circle.y, circle.r);
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, canvasR, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(0, 0, 0, ${(1 - circle.r/2.5)*0.15})`;
            ctx.fill();
            ctx.stroke();
        });
        ctx.restore(); 

        //createImageBitmap("/apoll_gasket.svg");

        // --- B. Rysowanie Cząstek SPH ---
        currentParticles.forEach(p => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Ciemny, półprzezroczysty kolor
            ctx.beginPath();
            ctx.arc(p.x, p.y, settings.DROPLET_RADIUS, 0, 2 * Math.PI);
            ctx.fill();
        });

    }, [size, normalizeAndScale]);

    // Rysowanie po każdej zmianie stanu (rotation lub particles)
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
            drawAll(ctx, AppollonianGasketCircles, rotation, particles);
        }
    }, [rotation, particles, drawAll, canvasRef]);
};