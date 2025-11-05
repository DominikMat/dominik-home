// useGasketSetup.ts

import { useCallback, useMemo } from 'react';
import { AppollonianGasketCircles } from './ApollonianData';
import { GasketProps, CircleData } from './types';

// Typ dla zwracanych funkcji i stałych
type GasketSetupResult = {
    centerX: number;
    centerY: number;
    maxDimension: number;
    normalizeAndScale: (x: number, y: number, r: number) => { canvasX: number; canvasY: number; canvasR: number };
    biggestCircle: CircleData;
};

export const useGasketSetup = (size: GasketProps['size'], scale: GasketProps['scale']): GasketSetupResult => {

    const biggestCircle = AppollonianGasketCircles[0];

    // --- 1. PRE-KALKULACJA PLANETY ---
    const { centerX, centerY, maxDimension } = useMemo(() => {
        const circles = AppollonianGasketCircles;
        // ... (Kod obliczający środek fraktala) ...
        const allX = circles.map(c => c.x);
        const allY = circles.map(c => c.y);
        const allR = circles.map(c => c.r);

        const minX = Math.min(...allX);
        const maxX = Math.max(...allX);
        const minY = Math.min(...allY);
        const maxY = Math.max(...allY);
        const maxR = Math.max(...allR);

        const radiusX = Math.max(Math.abs(minX) + maxR, Math.abs(maxX) + maxR);
        const radiusY = Math.max(Math.abs(minY) + maxR, Math.abs(maxY) + maxR);

        const centerX = 1;
        const centerY = 1.7320508075688772 / 3;
        const maxDimension = Math.max(radiusX, radiusY);

        return { centerX, centerY, maxDimension };
    }, []);

    // --- 2. NARZĘDZIA DO RYSOWANIA (DOPASOWANIE WSPÓŁRZĘDNYCH PLANETY) ---
    const normalizeAndScale = useCallback((x: number, y: number, r: number) => {
        const normalizedX = x - centerX;
        const normalizedY = y - centerY;

        // Skalowanie: Mapowanie z zakresu [-maxDimension, maxDimension] na [0, size]
        const canvasX = (normalizedX / maxDimension) * (size * scale / 2) + size / 2;
        const canvasY = (normalizedY / maxDimension) * (size * scale / 2) + size / 2;

        // Skalowanie promienia
        const canvasR = (r / maxDimension) * (size * scale / 2);

        return { canvasX, canvasY, canvasR };
    }, [size, scale, centerX, centerY, maxDimension]);

    return { centerX, centerY, maxDimension, normalizeAndScale, biggestCircle };
};