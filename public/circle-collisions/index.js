/* ---- Konfiguracja ---- */
const TWO_PI = 2 * Math.PI;
const OBJECT_NUM = 10;
const GRAVITY = { x: 0, y: 1000 }; // przyspieszenie px/s^2
const BOUNCE_MULT = 0.2;
const BOUNCE_MULT_OBJECTS = .2;
const BOUNCE_TORQUE = 100;
const MOUSE_EFFECT_RAD = 150;
const MOUSE_EFFECT_MULT = 2.5;
const ARC_SIZE_MULT = 0.3; // maks. rozmiar łuku (ułamek okręgu)
const MAX_DT = 0.05; // ograniczenie kroku czasu (s)
const MASS = 100;
const STABILIZE_VEL_THRESHOLD = 15;
const LINEAR_DAMPING = .4;
const ROTATIONAL_DAMPING = 4 ;
const ARC_MIN_SIZE = 0.1 * TWO_PI;
const FLOOR_DAMPING_ON_COLLISION_FACTOR = 0.05;
const COLLISION_SEPARATION_FACTOR = 0.15;

/* ---- Wektor 2D ---- */
class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v) { this.x += v.x; this.y += v.y; return this; }
  sub(v) { this.x -= v.x; this.y -= v.y; return this; }
  scale(s) { this.x *= s; this.y *= s; return this; }
  copy() { return new Vec2(this.x, this.y); }

  static add(a, b) { return new Vec2(a.x + b.x, a.y + b.y); }
  static sub(a, b) { return new Vec2(a.x - b.x, a.y - b.y); }
  static scale(v, s) { return new Vec2(v.x * s, v.y * s); }
  static dot(a, b) { return a.x * b.x + a.y * b.y; }

  length() { return Math.hypot(this.x, this.y); }
  normalize() {
    const len = this.length();
    if (len > 0) this.scale(1 / len);
    return this;
  }
}

/* ---- Canvas ---- */
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth * 0.95;
let height = canvas.height = window.innerHeight * 0.95;
ctx.lineWidth = 6;
ctx.strokeStyle = 'black';

/* ---- Mouse vars ---- */
let mousePos = new Vec2();
let mouseVel = new Vec2();

/* ---- Helper: normalizacja kąta i dystans kątowy z wrap-around ---- */
const norm = a => (a % TWO_PI + TWO_PI) % TWO_PI;

function angularDistance(a, b) {
    // najmniejsza odległość na kole (>=0)
    const d = Math.abs(a - b);
    return Math.min(d, TWO_PI - d);
}

function angleBetween(a, b) {
    const dot = a.x * b.x + a.y * b.y;
    const magA = Math.hypot(a.x, a.y);
    const magB = Math.hypot(b.x, b.y);
    return Math.acos(dot / (magA * magB)); // radians
}

function vectorAngle(v) {
    return Math.atan2(v.y, v.x);
}

function isAngleInArc(angle, arcStart, arcSpan) {
    const a = norm(angle);
    const start = norm(arcStart);
    const diff = norm(a - start);
    return diff <= arcSpan;
}
function getClosestAngleToArc(angle, arcAngle1, arcAngle2) {
    angle = norm(angle); arcAngle1 = norm(arcAngle1); arcAngle2 = norm(arcAngle2);
    //let arcLo = Math.min(arcAngle1,arcAngle2); let arcHi = Math.max(arcAngle1,arcAngle2);
    let arcLo = arcAngle1; let arcHi = arcAngle2;

    // jeśli arcLo < arcHi, przedział nie zawija; możemy użyć prostego testu:
    if (arcLo <= angle && angle <= arcHi) return angle;
    const dLo = angularDistance(angle, arcLo);
    const dHi = angularDistance(angle, arcHi);
    return dLo < dHi ? arcLo : arcHi;
}

// obraca wektor (x,y) o kąta phi (in-place)
function rotateVec(v, phi) {
    if (phi == 0) return v;
    const c = Math.cos(phi), s = Math.sin(phi);
    const nx = v.x * c - v.y * s;
    const ny = v.x * s + v.y * c;
    v.x = nx; v.y = ny;
    return v;
}

function calculateCircleIntersectionPointsOffset(p1, r1, p2, r2) {
    let distX = p2.x-p1.x;
    let distY = p2.y-p1.y;

    let distSqr = distX*distX + distY*distY;
    let dist = Math.sqrt(distSqr);

    // circles dont intersect (ignore single point collision)
    if (dist >= r1+r2 || dist == 0) return null;


    let rSqr = (r1*r1-r2*r2);
    let p = rSqr/(2*distSqr);

    let xp = (p1.x+p2.x)/2 + p*distX;
    let yp = (p1.y+p2.y)/2 + p*distY;

    let a = 0.5*Math.sqrt(2*((r1*r1+r2*r2)/(distSqr) - (rSqr*rSqr)/(distSqr*distSqr)) - 1);

    return {x1:(xp-a*distY), y1:(yp+a*distX), x2:(xp+a*distY), y2:(yp-a*distX)};
}

/* ---- Klasa obiektu (struct) ---- */
class Arc {
    constructor(x, y, r, angleSpan, rotation = 0, mass = 1) {
        this.centreOfCircle = new Vec2(x, y);  // Srodek masy (COM)
        this.vel = new Vec2(0, 0);
        this.force = new Vec2(0, 0);

        this.r = r;
        this.angleSpan = angleSpan;  // Szerokość łuku w radianach
        this.rotation = rotation;    // Całkowity kąt obrotu w radianach

        this.angleMid = this.rotation + this.angleSpan / 2;  // Środkowy kąt

        // Moment obrotowy
        this.rotationSpeed = 0; // omega
        this.torque = 0;        // Skumulowany moment obrotowy
        this.mass = mass;

        
        // Obliczanie środka masy (COM) — korzystamy ze wzoru
        const ycm = this.r * Math.sin(this.angleSpan / 2) / (this.angleSpan / 2);
        this.localCOMtoCOC = new Vec2(0, -ycm);  // Lokalny wektor od środka koła
        this.localCOMtoCOC = rotateVec(this.localCOMtoCOC, 1.5*Math.PI + this.angleMid);
        this.centreOfMass = Vec2.sub(this.centreOfCircle, this.localCOMtoCOC); // Globalny COM
        
        this.distanceToCentreOfMass = this.localCOMtoCOC.length();  // Odległość do COM
        const I_coc = this.mass * this.r * this.r;
        this.inertia = I_coc - this.mass * this.distanceToCentreOfMass * this.distanceToCentreOfMass;    

        // bounds
        this.boundsMax = new Vec2(0,0);
        this.boundsMin = new Vec2(0,0);

        // bounds
        this.collisionPoint1 = new Vec2(0,0);
        this.collisionPoint2 = new Vec2(0,0);
    }

    applyForce(force) {
        this.force.add( force );
    }
    applyTorque(force, angle) {
        // Obliczamy wektor od środka masy do punktu kontaktu
        const contact = Vec2.add(this.centreOfCircle, new Vec2(Math.cos(angle), Math.sin(angle)).scale(this.r));
        const r_vec = Vec2.sub(contact, this.centreOfMass);
        const torqueScalar = r_vec.x * force.y - r_vec.y * force.x;
        this.torque += torqueScalar;
    }
    integrate(dt) {
        // 1. Zastosuj siły (przyspieszenie) do prędkości
        this.vel.x += (this.force.x / this.mass) * dt;
        this.vel.y += (this.force.y / this.mass) * dt;
        this.force.x = 0; this.force.y = 0;

        // 3. Damping
        // Obliczamy mnożnik tłumienia zależny od 'dt'.
        // Math.max(0, ...) zapobiega "odwróceniu" prędkości, jeśli dt lub damping są duże.
        const linearDampMult = Math.max(0, 1.0 - LINEAR_DAMPING * dt);
        const rotationalDampMult = Math.max(0, 1.0 - ROTATIONAL_DAMPING * dt);

        // Zmniejszamy prędkość liniową i obrotową
        this.vel.scale(linearDampMult);
        this.rotationSpeed *= rotationalDampMult;
        
        // 4. Zastosuj (już wytłumioną) prędkość do pozycji
        this.centreOfMass.x += this.vel.x * dt;
        this.centreOfMass.y += this.vel.y * dt;
        
        // 5. Zastosuj (już wytłumioną) prędkość kątową do obrotu
        const deltaAngle = this.rotationSpeed * dt;
        this.rotation = norm(this.rotation + deltaAngle);
        this.angleMid = this.rotation + this.angleSpan / 2;

        // 6. Zaktualizuj pozycję rysowania (COC)
        this.localCOMtoCOC = rotateVec(this.localCOMtoCOC, deltaAngle);
        this.updateCOC();
        this.calcObjectBounds();
    }

    updateCOC() {
        this.centreOfCircle = Vec2.add(this.centreOfMass, this.localCOMtoCOC);
    }

    calcObjectBounds() {
        const a1 = this.rotation;
        const a2 = this.rotation + this.angleSpan;
        const coc = this.centreOfCircle;
        const p1 = new Vec2(coc.x + this.r * Math.cos(a1), coc.y + this.r * Math.sin(a1));
        const p2 = new Vec2(coc.x + this.r * Math.cos(a2), coc.y + this.r * Math.sin(a2));
        
        this.boundsMin = new Vec2(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y));
        this.boundsMax = new Vec2(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y));

        if (isAngleInArc(0, a1, this.angleSpan)) {
            this.boundsMax.x = Math.max(this.boundsMax.x, coc.x + this.r);
        }
        if (isAngleInArc(Math.PI, a1, this.angleSpan)) {
            this.boundsMin.x = Math.min(this.boundsMin.x, coc.x - this.r);
        }
        if (isAngleInArc(Math.PI / 2, a1, this.angleSpan)) {
            this.boundsMax.y = Math.max(this.boundsMax.y, coc.y + this.r);
        }
        if (isAngleInArc(Math.PI * 1.5, a1, this.angleSpan)) {
            this.boundsMin.y = Math.min(this.boundsMin.y, coc.y - this.r);
        }
    }

    applyImpulse (contactPoint, normal) {
        // Wektor od COM do punktu kontaktu
        const r_vec = Vec2.sub(contactPoint, this.centreOfMass);
        const v_rot = new Vec2(-this.rotationSpeed * r_vec.y, this.rotationSpeed * r_vec.x);
        const v_p = Vec2.add(this.vel, v_rot);
        const v_rel_normal = Vec2.dot(v_p, normal);
        if (v_rel_normal >= 0) return;

        // --- Obliczanie impulsu (j) ---
        const e = BOUNCE_MULT;
        const r_perp = r_vec.x * normal.y - r_vec.y * normal.x;
        const j_numerator = -(1 + e) * v_rel_normal;
        const j_denominator = (1 / this.mass) + (r_perp * r_perp / this.inertia);
        const j = j_numerator / j_denominator;
        const impulse_vec = Vec2.scale(normal, j);

        // --- Zastosowanie impulsu ---
        // Zmiana prędkości liniowej: dv = J / m
        this.vel.add(Vec2.scale(impulse_vec, 1 / this.mass));
        let torque = (r_vec.x * impulse_vec.y - r_vec.y * impulse_vec.x); // Zmiana prędkości kątowej: d(omega) = (r x J) / I
        this.rotationSpeed += torque / this.inertia;
    };

    handleBoundary(width, height) {
        // --- 1. DETEKCJA KOLIZJI (Znajdowanie prawdziwych granic) ---
        const a1 = this.rotation;
        const a2 = this.rotation + this.angleSpan;
        const coc = this.centreOfCircle; // Skrót
        
        // --- 3. SPRAWDZANIE I KOREKTA POZYCJI ---
        const rightAngle = getClosestAngleToArc(0, a1, a2);
        const leftAngle = getClosestAngleToArc(Math.PI, a1, a2);
        const downAngle = getClosestAngleToArc(Math.PI / 2, a1, a2);
        
        // Sprawdź podłogę
        if (this.boundsMax.y > height) {
            this.centreOfMass.y += height - this.boundsMax.y;
            const contactPoint = Vec2.add(coc, new Vec2(this.r * Math.cos(downAngle), this.r * Math.sin(downAngle)));
            this.applyImpulse(contactPoint, new Vec2(0, -1));
            this.updateCOC();
            if (Math.abs(this.vel.y) < STABILIZE_VEL_THRESHOLD) {
                this.vel.y = 0;
            }
            this.vel.x *= (1-FLOOR_DAMPING_ON_COLLISION_FACTOR);
        }
        
        // Sprawdź lewą ścianę
        if (this.boundsMin.x < 0) {
            this.centreOfMass.x += 0 - this.boundsMin.x;
            const contactPoint = Vec2.add(coc, new Vec2(this.r * Math.cos(leftAngle), this.r * Math.sin(leftAngle)));
            // Normalna lewej ściany to {1, 0}
            this.applyImpulse(contactPoint, new Vec2(1, 0));
            this.updateCOC();

            if (Math.abs(this.vel.x) < STABILIZE_VEL_THRESHOLD) {
                this.vel.x = 0;
            }
        }
        
        // Sprawdź prawą ścianę
        if (this.boundsMax.x > width) {
            this.centreOfMass.x += width - this.boundsMax.x;
            const contactPoint = Vec2.add(coc, new Vec2(this.r * Math.cos(rightAngle), this.r * Math.sin(rightAngle)));
            // Normalna prawej ściany to {-1, 0}
            this.applyImpulse(contactPoint, new Vec2(-1, 0));
            this.updateCOC();

            if (Math.abs(this.vel.x) < STABILIZE_VEL_THRESHOLD) {
                this.vel.x = 0;
            }
        }

    }

    applyPositionCorrection(otherArc, separationFactor = 0.5) {
        const r1 = this.r;
        const r2 = otherArc.r;
        
        // Wektor od CentreOfCircle drugiego obiektu do pierwszego
        const dVec = Vec2.sub(this.centreOfCircle, otherArc.centreOfCircle); 
        const dist = dVec.length();

        if (dist >= r1 + r2 || dist === 0) return;

        const penetrationDepth = r1 + r2 - dist;
        const normal = dVec.copy().normalize(); 
        const totalInvMass = 1 / this.mass + 1 / otherArc.mass;
        const correctionMagnitude = penetrationDepth / totalInvMass * separationFactor; // separationFactor < 1.0 (np. 0.5 lub 0.8)

        // Aplikacja korekty
        const correction1 = Vec2.scale(normal, correctionMagnitude / this.mass);
        const correction2 = Vec2.scale(normal, correctionMagnitude / otherArc.mass);

        this.centreOfMass.add(correction1);
        this.updateCOC(); // Zaktualizuj Centre of Circle
        
        otherArc.centreOfMass.sub(correction2); // Obiekt 2 przesuwa się w przeciwnym kierunku
        otherArc.updateCOC(); 
    }

    handleCollision(otherArc) {
        // check if objects overlap
        if (this.boundsMax.x < otherArc.boundsMin.x) return; // A na lewo od B
        if (this.boundsMin.x > otherArc.boundsMax.x) return; // A na prawo od B
        if (this.boundsMax.y < otherArc.boundsMin.y) return; // A powyzej B
        if (this.boundsMin.y > otherArc.boundsMax.y) return; // A ponizej B

        // there are 2 possible collision points when 2 circles overlap,
        // we calculate both position angles and check which one lies (if any) lie within our arc spans
        // then we apply impulses in that position for both objects repelling each other

        let collisionPoints = calculateCircleIntersectionPointsOffset(this.centreOfCircle, this.r, otherArc.centreOfCircle, otherArc.r);
        if (collisionPoints == null) {
            this.collisionPoint1 = new Vec2(0,0); this.collisionPoint2 = new Vec2(0,0); return;
        }

        //var cirlcePosVector = Vec2.sub(otherArc.centreOfCircle, this.centreOfCircle).scale(this.r/otherArc.r);
        this.collisionPoint1 = new Vec2(collisionPoints.x1, collisionPoints.y1);
        this.collisionPoint2 = new Vec2(collisionPoints.x2, collisionPoints.y2);

        const normal = Vec2.sub(this.centreOfCircle, otherArc.centreOfCircle).normalize();
        const normalOther = Vec2.scale(normal, -1); // Normalna dla drugiego obiektu

        let collisionAngle1 = vectorAngle(Vec2.sub(this.collisionPoint1, this.centreOfCircle));
        let collisionAngle2 = vectorAngle(Vec2.sub(this.collisionPoint2, this.centreOfCircle));
        let collisionAngle1Other = vectorAngle(Vec2.sub(this.collisionPoint1, otherArc.centreOfCircle));
        let collisionAngle2Other = vectorAngle(Vec2.sub(this.collisionPoint2, otherArc.centreOfCircle));

        if (isAngleInArc(collisionAngle1, this.rotation, this.angleSpan) && 
            isAngleInArc(collisionAngle1Other, otherArc.rotation, otherArc.angleSpan)) {
            
            this.applyPositionCorrection(otherArc, COLLISION_SEPARATION_FACTOR);
            this.applyImpulse(this.collisionPoint1, normal);
            otherArc.applyImpulse(this.collisionPoint1, normalOther);
        }
        if (isAngleInArc(collisionAngle2, this.rotation, this.angleSpan) && 
        isAngleInArc(collisionAngle2Other, otherArc.rotation, otherArc.angleSpan)) {

            this.applyPositionCorrection(otherArc, COLLISION_SEPARATION_FACTOR);
            this.applyImpulse(this.collisionPoint1, normal);            
            otherArc.applyImpulse(this.collisionPoint1, normalOther);

        }
    }

    applyMouseInteraction(mousePos, mouseVel) {
        const distVec = Vec2.sub(mousePos, this.centreOfMass);
        const dist = distVec.length();

        if (dist < MOUSE_EFFECT_RAD) {
        this.vel.add(Vec2.scale(mouseVel, MOUSE_EFFECT_MULT));
        }
    }

    draw(ctx, idx) {
        // main arc and fill colour
        ctx.beginPath();
        ctx.arc(this.centreOfCircle.x, this.centreOfCircle.y, this.r, this.rotation, this.rotation+this.angleSpan, false);
        ctx.strokeStyle = 'black';
        ctx.fillStyle = `hsla(${(idx * 80) % 360}, 70%, 60%, 0.6)`;
        ctx.fill();
        ctx.stroke();

        // centre of mass 
        ctx.beginPath();
        ctx.arc(this.centreOfMass.x, this.centreOfMass.y, 5, 0, 2 * Math.PI, false);  // mały okrąg w COM
        ctx.fillStyle = 'yellow';  // kolor punktu COM
        ctx.fill();
        ctx.stroke();

        // // collision points
        // ctx.beginPath();
        // ctx.arc(this.collisionPoint1.x, this.collisionPoint1.y, 5, 0, 2 * Math.PI, false);  // mały okrąg w COM
        // ctx.fillStyle = 'red';  // kolor punktu COM
        // ctx.fill();
        // ctx.stroke();
        
        // ctx.beginPath();
        // ctx.arc(this.collisionPoint2.x, this.collisionPoint2.y, 5, 0, 2 * Math.PI, false);  // mały okrąg w COM
        // ctx.fillStyle = 'blue';  // kolor punktu COM
        // ctx.fill();
        // ctx.stroke();
    }
}

/* ---- Stworzenie obiektów ---- */
let objects = [];
function initObjects() {
    objects = [];
    const cx = width / 2;
    const cy = height / 2;
    let currRotation = 0;
    const r = Math.min(width, height) * 0.25;

    for (let i = 0; i < OBJECT_NUM; i++) {
        let arcSpan = (Math.random() * (TWO_PI-ARC_MIN_SIZE)) * ARC_SIZE_MULT + ARC_MIN_SIZE;
        if (currRotation + arcSpan > TWO_PI - ARC_MIN_SIZE) arcSpan = TWO_PI-currRotation; // go to the end

        objects.push(new Arc(cx, cy, r, arcSpan, currRotation, MASS*(arcSpan/TWO_PI)));

        currRotation += arcSpan;
        if (currRotation >= TWO_PI) break;
    }
}

/* ---- Pętla animacji ---- */
let lastTs = 0;
let timeAccumulator = 0;
const FIXED_DT_S = 1 / 120; // 120 Hz
const MAX_STEPS = 5;

function loop(ts) {
    let dt = (ts - lastTs) / 1000;
    lastTs = ts;
    if (dt > MAX_DT) dt = MAX_DT    
    timeAccumulator += dt;

    let steps = 0;
    while (timeAccumulator >= FIXED_DT_S && steps < MAX_STEPS) {
            updatePhysics(FIXED_DT_S);
            timeAccumulator -= FIXED_DT_S;
            steps++;
    }

    // Rysowanie (odbywa się niezależnie)
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, width, height);
    objects.forEach((o, i) => o.draw(ctx, i));     
    requestAnimationFrame(loop);
}

// Stworzenie nowej funkcji do aktualizacji fizyki
function updatePhysics(dt) {
    // --- 1. Zastosuj siły i zintegruj pozycje ---
    objects.forEach((o, i) => {
        o.applyForce(Vec2.scale(GRAVITY,o.mass)); // Zastosuj grawitację
        o.applyMouseInteraction(mousePos, mouseVel); // Zastosuj myszkę
        o.integrate(dt); // Przesuń obiekty (Euler)
    });

    // --- Kolizje
    for (let i = 0; i < objects.length; i++) {
        objects[i].handleBoundary(width, height);
        for (let j = i + 1; j < objects.length; j++) {
            objects[i].handleCollision(objects[j]);
        }
    }
}

/* ---- Reset / init ---- */
function reset() {
  initObjects();
}

/* ---- Eventy ---- */
window.addEventListener('resize', () => {
    ctx.lineWidth = 6; ctx.strokeStyle = 'black';
    width = canvas.width = window.innerWidth * 0.95;
    height = canvas.height = window.innerHeight * 0.95;
});

window.addEventListener('mousemove', (e) => {
    const newPos = new Vec2(e.clientX, e.clientY);
    mouseVel = Vec2.sub(newPos, mousePos);
    mousePos = newPos;
});

window.addEventListener('keydown', (ev) => {
    if (ev.code === 'Space') reset();
});

/* ---- Start ---- */
initObjects();
requestAnimationFrame(loop);