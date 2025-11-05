
// --- SPH SIMULATION PARAMETERS ---
export const PARTICLE_NUM = 512;
export const PARTICLE_MASS = 1;
export const VEL_MULT = 3;
export const PARTICLE_BOUNCE_MULT = 0.6;
export const DELTA_TIME = 0.01;
export const VISCOSITY = 100;
export const SUPPORT_RAD = 50;
export const GAS_CONSTANT = 5;
export const RESTING_DENSITY = 1000;
export const CENTRAL_GRAVITY_STRENGTH = 5000;
export const SURFACE_DRAG_STRENGTH = 6.5;

// --- MOUSE ---
export const MOUSE_EFFECT_RAD = 100
export const MOUSE_EFFECT_MULT = 5

// --- SPH CONSTANTS ---
export const SUPPORT_SQ = SUPPORT_RAD * SUPPORT_RAD;
export const POLY6 = 4 / (Math.PI * Math.pow(SUPPORT_RAD, 9));
export const SPIKY_GRADIENT = -10 / (Math.PI * Math.pow(SUPPORT_RAD, 5));
export const VISCOSITY_LAPLACIAN = 40 / (Math.PI * Math.pow(SUPPORT_RAD, 5));
export const DROPLET_RADIUS = 5; // Zmniejszony promień kropli dla lepszej wizualizacji

// --- STAŁE PLANETY (Gasket) ---
export const BORDER_WIDTH = 3; 
export const ROTATION_SPEED = 0.003; 