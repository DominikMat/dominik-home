import { RefObject } from 'react';
import { SurfaceArc } from './useGasketSetup';

// Typ dla pojedynczej cząstki SPH
export interface ParticleState {
    x: number;
    y: number;
    vx: number;
    vy: number;
    fx: number;
    fy: number;
    density: number;
    pressure: number;
}

export interface CircleData {
  x: number;
  y: number;
  r: number;
}

// Typ dla danych wejściowych
export type SphSimulationProps = {
    size: number;
    planetData: CircleData;
    collisionSurface: SurfaceArc[];
};

export interface GasketProps {
    positionX: string; 
    positionY: string; 
    size: number;      
    sphEnabled: RefObject<boolean>;
}

export type MouseData = {
    vx: number;
    vy: number;
    px: number;
    py: number;
};

type Point = {
    x: number;
    y: number;
};

export type MouseRefs = {
    mousePosRef: RefObject<Point>;
    mouseVelRef: RefObject<Point>;
    clickCircle: RefObject<CircleData>;
    isMousePressed: RefObject<boolean>;
};

// Typ dla zwracanych funkcji i stałych
export type GasketSetupResult = {
    centerX: number;
    centerY: number;
    maxDimension: number;
    normalizeAndScale: (x: number, y: number, r: number) => { canvasX: number; canvasY: number; canvasR: number };
    biggestCircle: CircleData;
};