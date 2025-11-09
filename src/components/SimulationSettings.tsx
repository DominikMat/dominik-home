
// --- SPH SIMULATION PARAMETERS ---
export const PARTICLE_NUM = 512;
export const PARTICLE_MASS = 0.5;
export const VEL_MULT = 3;
export const PARTICLE_BOUNCE_MULT_NORMAL_DIR = 0.35;
export const PARTICLE_BOUNCE_MULT_TANGENT_DIR = 0.95;
export const VISCOSITY = 100;
export const SUPPORT_RAD = 40;
export const GAS_CONSTANT = 7;
export const RESTING_DENSITY = 1000;
export const CENTRAL_GRAVITY_STRENGTH = 2300;
export const SURFACE_DRAG_STRENGTH = 0;

// --- MOUSE ---
export const MOUSE_EFFECT_RAD = 100;
export const MOUSE_EFFECT_RAD_SQR = MOUSE_EFFECT_RAD*MOUSE_EFFECT_RAD;
export const MOUSE_EFFECT_MULT = 2.5;

// --- SPH CONSTANTS ---
export const SUPPORT_SQ = SUPPORT_RAD * SUPPORT_RAD;
export const POLY6 = 4 / (Math.PI * Math.pow(SUPPORT_RAD, 9));
export const SPIKY_GRADIENT = -10 / (Math.PI * Math.pow(SUPPORT_RAD, 5));
export const VISCOSITY_LAPLACIAN = 40 / (Math.PI * Math.pow(SUPPORT_RAD, 5));
export const DROPLET_RADIUS = 5; // Zmniejszony promień kropli dla lepszej wizualizacji

// --- CANVAS ---
export const CANVAS_SIDE_LEN = 2048;
export const CANVAS_SCALE = 1.5;

// --- STAŁE PLANETY (Gasket) ---
export const SURFACE_WIDTH = 5; 
export const ROTATION_SPEED = .3; 
export const PLANET_RADUIS_MULT = 0.25;
export const PLANET_RADUIS = PLANET_RADUIS_MULT * CANVAS_SIDE_LEN;

// --- PLANET SLICER ---
export const SLICE_CIRCLE_GROWTH = 225;
export const MAX_SLICE_CIRCLE_SIZE = 300; 
export const GROW_RATE_FACTOR = 1.5; // Nowy parametr: stopień "easy-out"

// --- OPTIMIZATION PARAMS ---
export const TARGET_SIMULATION_FPS = 100
export const SIMULATION_DELTA_TIME = 1 / TARGET_SIMULATION_FPS;

export const TARGET_CANVAS_FPS = 100
export const CANVAS_DELTA_TIME = 1 / TARGET_SIMULATION_FPS;