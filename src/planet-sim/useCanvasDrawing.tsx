// useCanvasDrawing.ts

import { useCallback, RefObject } from 'react'; // Dodaj RefObject
import { ParticleState, CircleData } from './types';
import { SurfaceArc } from './useGasketSetup';
import * as settings from './SimulationSettings';

// let gasketImgLoaded = false;
// const gasketSvgPath = '/dominik-home/apoll_gasket.svg';
// const gasketSvg = new Image();

// gasketSvg.onload = () => { gasketImgLoaded = true; };
// gasketSvg.onerror = (e) => { console.error('Błąd ładowania obrazu', e); };
// gasketSvg.src = gasketSvgPath;

export const useCanvasDrawing = (
    size: number, 
    gasketArcs: SurfaceArc[],
    planetData: CircleData,
    clickCircle: RefObject<CircleData>,
    sliceHoles: CircleData[],
    sphEnabled: boolean
) => {

    // 5. RYSOWANIE NA CANVAS (Gasket + SPH)
    const drawAll = useCallback((ctx: CanvasRenderingContext2D, currentRotation: number, particlesRef: RefObject<ParticleState[]>) => {

        ctx.clearRect(0, 0, size, size);

        // --- Rotate canvas ---
        const center = size / 2;
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(currentRotation);
        ctx.translate(-center, -center);
        
        // --- Draw gasket SVG ---
        // if (gasketImgLoaded) {
        //     const box = planetData.r * 2;
        //     const scale = Math.max(box / gasketSvg.width, box / gasketSvg.height);
        //     const dw = gasketSvg.width * scale;
        //     const dh = gasketSvg.height * scale;
        //     const dx = planetData.x - dw / 2;
        //     const dy = planetData.y - dh / 2;
        //     ctx.drawImage(gasketSvg, dx, dy, dw, dh);
        // }
    
        // --- Erasme sliced holes in svg ---
        // ctx.globalCompositeOperation = 'destination-out';
        // ctx.fillStyle = '#000'
        // for (let i = 0; i < sliceHoles.length; i++) {
        //     let h = sliceHoles[i];
        //     ctx.beginPath();
        //     ctx.arc(h.x, h.y, h.r, 0, Math.PI*2);
        //     ctx.closePath();
        //     ctx.fill();
        // }
        
        ctx.restore();

        if (sphEnabled) {
            // --- Rysowanie Cząstek SPH ---
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Ciemny, półprzezroczysty kolor
            particlesRef.current.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, settings.DROPLET_RADIUS, 0, 2 * Math.PI);
                ctx.fill();
            });
        }

        // --- Draw Collision Surface ---
        // ctx.strokeStyle = '#000000';
        // ctx.lineWidth = settings.SURFACE_WIDTH;
        // gasketArcs.forEach((arc,idx) => {
        //     if (arc.enabled && arc.surface) {
        //         ctx.beginPath();
        //         if (arc.fullCircle) ctx.arc(arc.x, arc.y, arc.r, 0, 2 * Math.PI);
        //         else ctx.arc(arc.x, arc.y, arc.r, arc.angleStart, arc.angleStart+arc.angleSpan);
        //         ctx.stroke();
        //     }
        // });
        ctx.strokeStyle = '#000000';
        gasketArcs.forEach((arc,idx) => {
            if (arc.enabled) {
                ctx.lineWidth = arc.surface ? settings.SURFACE_WIDTH : settings.SURFACE_WIDTH/2;
                ctx.beginPath();
                if (arc.fullCircle) ctx.arc(arc.x, arc.y, arc.r, 0, 2 * Math.PI);
                else ctx.arc(arc.x, arc.y, arc.r, arc.angleStart, arc.angleStart+arc.angleSpan);
                ctx.stroke();
            }
        });

        // --- Rysowanie Sfery destrukcji ---
        ctx.strokeStyle = '#b1b1b1ff'
        ctx.lineWidth = 4;
        ctx.fillStyle = '#86868636';

        ctx.beginPath();
        ctx.arc(clickCircle.current.x, clickCircle.current.y, clickCircle.current.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

    }, [size, planetData, gasketArcs, sliceHoles, clickCircle]);

    // Rysowanie po każdej zmianie stanu (rotation lub particles)
    // useEffect(() => {
    //     const canvas = canvasRef.current;
    //     const ctx = canvas?.getContext('2d');
    //     if (ctx) {
    //         drawAll(ctx, rotation, particles);
    //     }
    // }, [rotation, particles, drawAll, canvasRef]);

    return { drawAll }
};