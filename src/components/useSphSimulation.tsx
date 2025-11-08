// useSphSimulation.ts

import { useState, useEffect, useCallback } from 'react';
import * as settings from './SimulationSettings';
import { MouseData, SphSimulationProps, ParticleState} from './types';
import { SurfaceArc } from './useGasketSetup';

// Typ dla danych myszy

const TWO_PI = 2*Math.PI;
const norm = (a:number) => (a % TWO_PI + TWO_PI) % TWO_PI;

export const useSphSimulation = ({ size, planetData, collisionSurface }: SphSimulationProps) => {
    const [particles, setParticles] = useState<ParticleState[]>([]);

    const W = size;
    const H = size;

    // 4.1. FUNKCJA ZMIANY STANU (GĘSTOŚĆ/CIŚNIENIE)
    const computeState = useCallback((currentParticles: ParticleState[]): ParticleState[] => {
        const newParticles = currentParticles.map(p1 => ({ ...p1, density: 0, pressure: 0 }));

        for (let p1 = 0; p1 < settings.PARTICLE_NUM; p1++) {
            for (let p2 = 0; p2 < settings.PARTICLE_NUM; p2++) {
                const distSq = Math.pow(newParticles[p2].x - newParticles[p1].x, 2) + Math.pow(newParticles[p2].y - newParticles[p1].y, 2);
                if (distSq < settings.SUPPORT_SQ) {
                    newParticles[p1].density += settings.PARTICLE_MASS * settings.POLY6 * Math.pow(settings.SUPPORT_SQ - distSq, 3);
                }
            }
            newParticles[p1].pressure = settings.GAS_CONSTANT * (newParticles[p1].density - settings.RESTING_DENSITY);
        }
        return newParticles;
    }, []);

    // 4.2. FUNKCJA OBLICZANIA SIŁ (GRAWITACJA CENTRALNA + WIATR OBROTOWY)
    const computeForces = useCallback((currentParticles: ParticleState[]): ParticleState[] => {

        const newParticles = currentParticles.map(p => ({ ...p, fx: 0, fy: 0 }));

        for (let p1 = 0; p1 < settings.PARTICLE_NUM; p1++) {
            // ... (logika obliczania sił: lepkość i ciśnienie) ...
            let viscosityX = 0, viscosityY = 0, pressureX = 0, pressureY = 0;
            let surfaceDragX = 0; let surfaceDragY = 0;

            for (let p2 = 0; p2 < settings.PARTICLE_NUM; p2++) {
                if (p1 === p2) continue;

                const dirX = (newParticles[p2].x - newParticles[p1].x);
                const dirY = (newParticles[p2].y - newParticles[p1].y);
                const dist = Math.sqrt(Math.pow(dirX, 2) + Math.pow(dirY, 2));

                if (dist < settings.SUPPORT_RAD) {
                    const normDirX = dirX / dist;
                    const normDirY = dirY / dist;

                    /* Ciśnienie */
                    const pressureMult = settings.PARTICLE_MASS * (newParticles[p1].pressure + newParticles[p2].pressure) / (2 * newParticles[p2].density)
                        * settings.SPIKY_GRADIENT * Math.pow(settings.SUPPORT_RAD - dist, 3);
                    pressureX += -normDirX * pressureMult;
                    pressureY += -normDirY * pressureMult;

                    /* Lepkość */
                    const viscosityMult = settings.VISCOSITY * settings.PARTICLE_MASS / newParticles[p2].density
                        * settings.VISCOSITY_LAPLACIAN * (settings.SUPPORT_RAD - dist);
                    viscosityX += (newParticles[p2].vx - newParticles[p1].vx) * viscosityMult;
                    viscosityY += (newParticles[p2].vy - newParticles[p1].vy) * viscosityMult;
                }
            }
            
            // Grawitacja Centralna
            const dx = planetData.x - newParticles[p1].x;
            const dy = planetData.y - newParticles[p1].y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);
            
            let gravityX = 0; let gravityY = 0;

            if (dist > planetData.r) {
                gravityX = (dx / dist) * settings.CENTRAL_GRAVITY_STRENGTH;
                gravityY = (dy / dist) * settings.CENTRAL_GRAVITY_STRENGTH;
            } else {
                gravityX = (dx / dist) * settings.CENTRAL_GRAVITY_STRENGTH * (dist/planetData.r);
                gravityY = (dy / dist) * settings.CENTRAL_GRAVITY_STRENGTH * (dist/planetData.r);
            }

            // --- Tarcie Powierzchniowe (Surface Drag) ---
            if (dist > planetData.r) {
                const normX = -dx / dist; 
                const normY = -dy / dist;
                const radialSpeed = newParticles[p1].vx * normX + newParticles[p1].vy * normY;
                const tanVelX = newParticles[p1].vx - radialSpeed * normX;
                const tanVelY = newParticles[p1].vy - radialSpeed * normY;
                const distanceFromSurface = dist - planetData.r;
                const influence = Math.max(0, 1 - distanceFromSurface / settings.SUPPORT_RAD);
                surfaceDragX = -tanVelX * influence * settings.SURFACE_DRAG_STRENGTH;
                surfaceDragY = -tanVelY * influence * settings.SURFACE_DRAG_STRENGTH;
            }


            // Sumowanie wszystkich sił
            newParticles[p1].fx = pressureX + viscosityX + gravityX + surfaceDragX;
            newParticles[p1].fy = pressureY + viscosityY + gravityY + surfaceDragY;
        }
        return newParticles;
    }, [planetData]);

    // 4.3. FUNKCJA APLIKACJI I KOLIZJI 
    const applyPhysics = useCallback((currentParticles: ParticleState[], mouseData: MouseData): ParticleState[] => {
        const mouseVelX = mouseData.vx;
        const mouseVelY = mouseData.vy;
        const mousePosX = mouseData.px;
        const mousePosY = mouseData.py;

        return currentParticles.map(p => {
            // Euler explicit
            let vx = p.vx + p.fx * settings.DELTA_TIME;
            let vy = p.vy + p.fy * settings.DELTA_TIME;
            let x = p.x + vx * settings.DELTA_TIME;
            let y = p.y + vy * settings.DELTA_TIME;

            // --- INTERAKCJA MYSZKI ---
            const mouseDistX = (mousePosX - x);
            const mouseDistY = (mousePosY - y);
            const distToMouse = Math.sqrt(Math.pow(mouseDistX, 2) + Math.pow(mouseDistY, 2));

            if (distToMouse < settings.MOUSE_EFFECT_RAD) {
                vx += mouseVelX * settings.MOUSE_EFFECT_MULT;
                vy += mouseVelY * settings.MOUSE_EFFECT_MULT;
            }

            // Kolizje ze ścianami
            if (x < settings.DROPLET_RADIUS || x > W - settings.DROPLET_RADIUS) vx *= -settings.PARTICLE_BOUNCE_MULT;
            if (y < settings.DROPLET_RADIUS || y > H - settings.DROPLET_RADIUS) vy *= -settings.PARTICLE_BOUNCE_MULT;
            x = Math.max(settings.DROPLET_RADIUS, Math.min(W - settings.DROPLET_RADIUS, x));
            y = Math.max(settings.DROPLET_RADIUS, Math.min(H - settings.DROPLET_RADIUS, y));

            // KOLIZJA Z PLANETĄ 
            for(let j=0; j<collisionSurface.length; j++){
                let a = collisionSurface[j];
                if (!a.enabled || !a.surface) continue;

                let dx = x - a.x;
                let dy = y  - a.y;

                if (!a.fullCircle) {
                    let particleAngle = Math.atan2(dy,dx);
                    if (norm(particleAngle-a.angleStart) > a.angleSpan) continue;
                }
                let dist = Math.sqrt(dx*dx+dy*dy);
                let collisionSide = (a.outer ? 1 : -1);

                const collisionBandOtherSide = 1.0*settings.DROPLET_RADIUS; 
                const collisionBandCollisionSide = 4.0*settings.DROPLET_RADIUS;

                if ( (a.outer && (dist > a.r - collisionBandOtherSide && dist < a.r + collisionBandCollisionSide) )
                    || (!a.outer && (dist > a.r - collisionBandCollisionSide && dist < a.r + collisionBandOtherSide)) ) {

                    const penetrationDepth = (a.r - dist) * collisionSide + collisionBandCollisionSide ;
                    const normX = dx / dist * collisionSide;
                    const normY = dy / dist * collisionSide;
                    x += normX * penetrationDepth;
                    y += normY * penetrationDepth;

                    const speedAlongNormal = vx * normX + vy * normY;

                    if (speedAlongNormal < 0) {
                        const normalVelX = speedAlongNormal * normX;
                        const normalVelY = speedAlongNormal * normY;
                        const tangentVelX = vx - normalVelX;
                        const tangentVelY = vy - normalVelY;
                        vx = tangentVelX - normalVelX * settings.PARTICLE_BOUNCE_MULT;
                        vy = tangentVelY - normalVelY * settings.PARTICLE_BOUNCE_MULT;
                    }
                }
            }
            return { ...p, x, y, vx, vy };
        });
    }, [planetData, W, H, collisionSurface]);

    // 4.4. PĘTLA SPH
    const sphLoop = useCallback((mouseData: MouseData) => {
        setParticles(prevParticles => {
            if (prevParticles.length === 0) return [];

            // 1. Obliczenie gęstości i ciśnienia
            const withState = computeState(prevParticles);

            // 2. Obliczenie sił
            const withForces = computeForces(withState);

            // 3. Zastosowanie sił i kolizji
            let updatedParticles = applyPhysics(withForces, mouseData);

            // --- TRANSFORMACJA ROTACYJNA 1:1 ---
            // const ROTATION_ANGLE = settings.ROTATION_SPEED;

            // //if (ROTATION_ANGLE !== 0) {
            // const cosA = Math.cos(ROTATION_ANGLE);
            // const sinA = Math.sin(ROTATION_ANGLE);

            // updatedParticles = updatedParticles.map(p => {
            //     const dx = p.x - planetData.x;
            //     const dy = p.y - planetData.y;

            //     const rotatedDX = dx * cosA - dy * sinA;
            //     const rotatedDY = dx * sinA + dy * cosA;

            //     const newX = planetData.x + rotatedDX;
            //     const newY = planetData.y + rotatedDY;

            //     return { ...p, x: newX, y: newY };
            // });
            //}
            // --- KONIEC TRANSFORMACJI ROTACYJNEJ ---

            return updatedParticles;
        });
    }, [computeState, computeForces, applyPhysics, planetData]);

    // 3. INICJALIZACJA SPH
    useEffect(() => {
        const initialParticles: ParticleState[] = [];

        const spawnRadius = planetData.r + settings.SUPPORT_RAD * 2; 

        for (let i = 0; i < settings.PARTICLE_NUM; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const distance = (planetData.r+settings.SUPPORT_RAD) + Math.random() * (spawnRadius - planetData.r);

            const x = planetData.x + distance * Math.cos(angle);
            const y = planetData.y + distance * Math.sin(angle);

            initialParticles.push({
                x, y,
                vx: 0, vy: 0,
                fx: 0, fy: 0,
                density: 0, pressure: 0
            });
        }

        setParticles(initialParticles);
    }, [size, planetData]);

    return { particles, sphLoop };
};