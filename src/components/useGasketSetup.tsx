// useGasketSetup.ts

import { useCallback, useEffect, useMemo } from 'react';
import { AppollonianGasketCircles } from './ApollonianData';
import { GasketProps, CircleData, GasketSetupResult } from './types';
import * as settings from './SimulationSettings';
import { App } from 'antd';

const TWO_PI = Math.PI*2;

export enum TwoCircleState { Apart, Intersecting, FirstInsideSecond, SecondInsideFirst }

export function findTwoCircleState(c1: CircleData, c2: CircleData): TwoCircleState{
    let dx = c2.x-c1.x;
    let dy = c2.y-c1.y;
    let dist = Math.sqrt(dx*dx + dy*dy);
    
    if (!circlesOverlap(c1,c2,dist)) return TwoCircleState.Apart;
    if (circleWithin(c1,c2,dist)) return TwoCircleState.FirstInsideSecond;
    if (circleWithin(c2,c1,dist)) return TwoCircleState.SecondInsideFirst;

    return TwoCircleState.Intersecting;
}
function circlesOverlap(c1:CircleData,c2:CircleData,dist:number) {
    return dist < c1.r+c2.r;
}
function circleWithin(c1:CircleData,c2:CircleData,dist:number) {
    return dist < c2.r-c1.r;
}
function calculateCircleIntersectionPoints(c1:CircleData, c2:CircleData) {    
    let distX = c2.x-c1.x;
    let distY = c2.y-c1.y;
    
    let distSqr = distX*distX + distY*distY;
    let dist = Math.sqrt(distSqr);

    // circles not rouching or completely within (if dist == 0 also checkes -> not div 0)
    if (dist >= c1.r+c2.r || dist < Math.max(c1.r, c2.r)-Math.min(c1.r,c2.r)) return null;

    let rSqr = (c1.r*c1.r-c2.r*c2.r);
    let p = rSqr/(2*distSqr);

    let xp = (c1.x+c2.x)/2 + p*distX;
    let yp = (c1.y+c2.y)/2 + p*distY;

    let a = 0.5*Math.sqrt(2*(c1.r*c1.r+c2.r*c2.r)/(distSqr) - (rSqr*rSqr)/(distSqr*distSqr) - 1);

    return {x1:(xp-a*distY), y1:(yp+a*distX), x2:(xp+a*distY), y2:(yp-a*distX)};
}
const norm = (a:number) => (a % TWO_PI + TWO_PI) % TWO_PI;

export class SurfaceArc implements CircleData{
    public x: number = 0;
    public y: number = 0;
    public r: number = 0;
    public fullCircle: boolean = true;
    public angleStart: number = 0;
    public angleSpan: number = TWO_PI;
    public surface: boolean = false;
    public nextArc: SurfaceArc | null = null;
    public prevArc: SurfaceArc | null = null;
    public enabled: boolean = true;
    public outer: boolean = false;

    constructor (x: number, y: number, r: number, angle: number, span: number, outer=false) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.fullCircle = span == TWO_PI;
        this.angleStart = this.fullCircle ? 0 : angle;
        this.angleSpan = this.fullCircle ? TWO_PI : span;
        this.surface = false;
        this.nextArc = null;
        this.prevArc = null;
        this.enabled = true;
        this.outer = outer;
    }

    slice (cuttingCircle: CircleData, prevCircle: SurfaceArc | null, nextCircle: SurfaceArc | null) {
        let overlapState = findTwoCircleState(this,cuttingCircle);

        switch (overlapState) {
            case TwoCircleState.Apart || TwoCircleState.SecondInsideFirst:
                return;
            case TwoCircleState.FirstInsideSecond:
                this.disable(); 
                return;
        }

        let oldPrevArc = this.prevArc;
        let oldNextArc = this.nextArc;
        if (prevCircle) this.prevArc = prevCircle;
        if (nextCircle) this.nextArc = nextCircle;

        let intersect = calculateCircleIntersectionPoints(this, cuttingCircle);
        if (intersect == null) return;

        // intersectionPoints.push ( {x:intersect.x1, y:intersect.y1 } );
        // intersectionPoints.push ( {x:intersect.x2, y:intersect.y2 } );

        let angleIntersect1 = norm(Math.atan2(intersect.y1-this.y,intersect.x1-this.x));
        let angleIntersect2 = norm(Math.atan2(intersect.y2-this.y,intersect.x2-this.x));    

        const isAngleInside = (angle: number) => {
            let px = this.x + this.r * Math.cos(angle);
            let py = this.y + this.r * Math.sin(angle);
            // Sprawdzamy dystans do kwadratu, dodajemy mały epsilon dla stabilności
            return (px - cuttingCircle.x)**2 + (py - cuttingCircle.y)**2 < cuttingCircle.r**2 - 1e-9; 
        };

        // special case for full circle: cut hole, make not full
        if (this.fullCircle) {
            let shortArcMidAngle = norm(angleIntersect1 + norm(angleIntersect2 - angleIntersect1) / 2);
            let firstAngle = angleIntersect1;
            let secondAngle = angleIntersect2;

            if (!isAngleInside(shortArcMidAngle)) {
                firstAngle = angleIntersect2;
                secondAngle = angleIntersect1;
            }

            this.angleStart = secondAngle;
            this.angleSpan = norm(TWO_PI - norm(secondAngle - firstAngle));
            this.fullCircle = false;
            return;
        } 

        let antiClockwiseDist1 = norm(angleIntersect1 - this.angleStart);
        let antiClockwiseDist2 = norm(angleIntersect2 - this.angleStart);

        let minIntersectAngle = angleIntersect1;
        let maxIntersectAngle = angleIntersect2;
        let minAntiClockwiseDist = antiClockwiseDist1;
        let maxAntiClockwiseDist = antiClockwiseDist2;

        if (antiClockwiseDist2 < antiClockwiseDist1) {
            minIntersectAngle = angleIntersect2;
            maxIntersectAngle = angleIntersect1;
            minAntiClockwiseDist = antiClockwiseDist2;
            maxAntiClockwiseDist = antiClockwiseDist1;
        }

        let minAngleWithinArc = minAntiClockwiseDist <= this.angleSpan + 1e-10
        let maxAngleWithinArc = maxAntiClockwiseDist <= this.angleSpan + 1e-10
        const originalAngleEnd = norm(this.angleStart + this.angleSpan);

        
        // split arc in two parts
        if (minAngleWithinArc && maxAngleWithinArc) {
            let midSegmentAngle = norm(minIntersectAngle + norm(maxIntersectAngle - minIntersectAngle) / 2);

            if (isAngleInside(midSegmentAngle)) {
                let newArcSpan = norm(originalAngleEnd - maxIntersectAngle); 
                this.angleSpan = minAntiClockwiseDist; 
                
                let newArc = new SurfaceArc(this.x, this.y, this.r, maxIntersectAngle, newArcSpan); 
                newArc.prevArc = prevCircle;
                newArc.nextArc = oldNextArc;
                newArc.outer = this.outer;
                this.prevArc = oldPrevArc;
                this.nextArc = nextCircle;
                return newArc;
            } else {
                this.angleStart = minIntersectAngle;
                this.angleSpan = norm(maxAntiClockwiseDist - minAntiClockwiseDist);
                return;
            }
        }

        // shorten arc left side
        else if (minAngleWithinArc) {
            let midSegmentAngle = norm(minIntersectAngle + norm(originalAngleEnd - minIntersectAngle) / 2);

            if (isAngleInside(midSegmentAngle)) {
                this.angleSpan = minAntiClockwiseDist;
            } else {
                this.angleSpan = norm(originalAngleEnd - minIntersectAngle);
                this.angleStart = minIntersectAngle;
            }
            return;
        }

        // shorten arc right side
        else if (maxAngleWithinArc){
            let midSegmentAngle = norm(this.angleStart + maxAntiClockwiseDist / 2);

            if (isAngleInside(midSegmentAngle)) {
                this.angleSpan = norm(originalAngleEnd - maxIntersectAngle);
                this.angleStart = maxIntersectAngle;
            } else {
                this.angleSpan = maxAntiClockwiseDist;
            }
            return;
        }

        else {
            let midArcAngle = norm(this.angleStart + this.angleSpan / 2);
            if (isAngleInside(midArcAngle)) {
                this.disable();
            }
            return;
        }
    }
    propagateSurface(surfaceVal: boolean) {
        this.surface = surfaceVal;
        if (this.prevArc && !this.prevArc.surface == surfaceVal) this.prevArc.propagateSurface(surfaceVal);
        if (this.nextArc && !this.nextArc.surface == surfaceVal) this.nextArc.propagateSurface(surfaceVal);
    }
    disable() {
        this.enabled = false;
        if (this.prevArc && this.nextArc) {
            this.prevArc.nextArc = this.nextArc;
            this.nextArc.prevArc = this.prevArc;
        } 
    }
}

function convertToCanvasSpace(c: CircleData, size:number) {
    const centerX = 1;
    const centerY = 1.7320508075688772 / 3;
    const raduisMult = settings.PLANET_RADUIS / AppollonianGasketCircles[0].r;

    return {x:((c.x-centerX)*raduisMult)+size/2,
            y:((c.y-centerY)*raduisMult)+size/2,
            r:c.r*raduisMult
    }
}

export const useGasketSetup = (size: GasketProps['size']) => {

    // --- CONVERT GASKET TO SURFACE ARC CLASSES ---
    const planetData: CircleData = useMemo(() => {
        return convertToCanvasSpace(AppollonianGasketCircles[0], size);
    }, [size]);
    
    const gasketArcs: SurfaceArc[] = useMemo(() => {
        const arcs: SurfaceArc[] = [];
        for (let i=0; i<AppollonianGasketCircles.length; i++) {
            let canvasCircle = convertToCanvasSpace( AppollonianGasketCircles[i], size );
            arcs.push( new SurfaceArc(canvasCircle.x, canvasCircle.y, canvasCircle.r, 0, TWO_PI, i==0) );
        }
        arcs[0].surface = true;
        return arcs;
    }, [size] );

    // --- 2. NARZĘDZIA DO RYSOWANIA (DOPASOWANIE WSPÓŁRZĘDNYCH PLANETY) ---
    // const normalizeAndScale = useCallback((x: number, y: number, r: number) => {
    //     const normalizedX = x - centerX;
    //     const normalizedY = y - centerY;

    //     // Skalowanie: Mapowanie z zakresu [-maxDimension, maxDimension] na [0, size]
    //     const canvasX = (normalizedX / maxDimension) * (size * scale / 2) + size / 2;
    //     const canvasY = (normalizedY / maxDimension) * (size * scale / 2) + size / 2;

    //     // Skalowanie promienia
    //     const canvasR = (r / maxDimension) * (size * scale / 2);

    //     return { canvasX, canvasY, canvasR };
    // }, [size, scale, centerX, centerY, maxDimension]);

    return { gasketArcs, planetData };
};