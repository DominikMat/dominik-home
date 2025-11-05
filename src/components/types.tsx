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
    biggestCircle: CircleData;
    normalizeAndScale: (x: number, y: number, r: number) => { canvasX: number; canvasY: number; canvasR: number };
};

export interface GasketProps {
    positionX: string; 
    positionY: string; 
    scale: number;     
    size: number;      
}

export type MouseData = {
    vx: number;
    vy: number;
    px: number;
    py: number;
};

export type MouseRefs = {
    mouseData: MouseData;
};
