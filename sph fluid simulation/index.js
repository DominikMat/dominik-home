/* Canvas */
let canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d")

let width = canvas.width = window.innerWidth*.95
let height = canvas.height = window.innerHeight*.95

/* particle data */
const particleImg = new Image()
particleImg.src = "./graphics/droplet.png"
let xPositions = []
let yPositions = []
let xVelocities = []
let yVelocities = []
let xForces = []
let yForces = []
let densities = []
let pressures = []
let spacePressed = false

/* constant data */
const particleNum = 512
const particleMass = 100
const gravity = { x: 0, y: 1800 }
const velMult = 3
const bounceMult = .8
const deltaTime = 0.01
const dropletRaduis = 20

const viscosity = 120
const supportRad = 50
const gasConstant = 45
const restingDensity = 120

const mouseEffectRad = 150
const mouseEffectMult = 2.5

const supportSq = supportRad*supportRad
let poly6 = 0
let spikyGradient = 0
let viscosityLaplacian = 0
let mousePosX = 0
let mousePosY = 0

/* Initialization */
window.onload = () => { init(); }
function init(){
    gravity.x *= width
    gravity.y *= height
    
    for(let i=0; i<particleNum; i++){
        xPositions[i] = Math.random() * width * .8
        yPositions[i] = Math.random() * height * .8
        xVelocities[i] = (Math.random()-.5)*2 * width * velMult
        yVelocities[i] = (Math.random()-.5)*2 * height * velMult
        xForces[i] = 0
        yForces[i] = 0
    }
    
    setInterval(loop,1000*deltaTime)
    
    poly6 = 4 / (Math.PI*Math.pow(supportRad,9))
    spikyGradient = -10 / (Math.PI*Math.pow(supportRad,5))
    viscosityLaplacian = 40 / (Math.PI*Math.pow(supportRad,5))
}

/* Simulation */
function loop(){
    if(spacePressed) reset()
    state()
    forces()
    playerInput()
    apply()
}

function state(){
    /* Density field */
    for(let p1=0; p1<particleNum; p1++){
        densities[p1] = 0
        for(let p2=0; p2<particleNum; p2++){
            let distSq = Math.pow(xPositions[p2]-xPositions[p1],2) + Math.pow(yPositions[p2]-yPositions[p1],2)
            if(distSq < supportSq) densities[p1] += particleMass * poly6 * Math.pow(supportSq-distSq,3)
        }
        pressures[p1] = gasConstant * (densities[p1]-restingDensity)
    }
}

function forces(){
    /* Compute Forces */
    for(let p1=0; p1<particleNum; p1++){
        let viscosityX = 0, viscosityY = 0, pressureX = 0, pressureY = 0

        for(let p2=0; p2<particleNum; p2++){
            if(p1==p2) continue;
            /* direction vector */
            let dirX = (xPositions[p2]-xPositions[p1])
            let dirY = (yPositions[p2]-yPositions[p1])
            let dist = Math.sqrt(Math.pow(dirX,2)+Math.pow(dirY,2))

            /* normalize */
            dirX /= dist
            dirY /= dist
            
            if(dist < supportRad){
                /* Pressure */
                let pressureMult = particleMass*(pressures[p1]+pressures[p2]) / (2*densities[p2]) 
                    * spikyGradient * Math.pow(supportRad-dist,3)
                pressureX += -dirX*pressureMult
                pressureY += -dirY*pressureMult 

                /* Viscosity */
                let viscosityMult = viscosity * particleMass / densities[p2]
                    * viscosityLaplacian * (supportRad-dist)
                viscosityX += (xVelocities[p2]-xVelocities[p1]) * viscosityMult
                viscosityY += (yVelocities[p2]-yVelocities[p1]) * viscosityMult
            }
        }

        /* only y gravity component */
        let gravityFrc = gravity.y * densities[p1]
        xForces[p1] = pressureX+viscosityX
        yForces[p1] = pressureY+viscosityY+gravityFrc
    }
}

function playerInput(){
    for(let i=0; i<particleNum; i++){
        let mouseDistX = (mousePosX - xPositions[i])
        let mouseDistY = (mousePosY - yPositions[i])
        let dist = Math.sqrt(Math.pow(mouseDistX,2)+Math.pow(mouseDistY,2))

        if(dist < mouseEffectRad){
            xVelocities[i] += mouseVelX * mouseEffectMult
            yVelocities[i] += mouseVelY * mouseEffectMult
        }
    }
}

function apply(){
    /* reset canvas*/
    ctx.fillStyle = "grey"
    ctx.fillRect(0,0,width,height)

    /* game loop */
    for(let i=0; i<particleNum; i++){
        /* euler explicit */
        xVelocities[i] += xForces[i] * deltaTime
        yVelocities[i] += yForces[i] * deltaTime
        xPositions[i] += xVelocities[i] * deltaTime
        yPositions[i] += yVelocities[i] * deltaTime

        if(xPositions[i] < dropletRaduis) { 
            xPositions[i] = dropletRaduis
            xVelocities[i] *= -bounceMult
        }
        else if(xPositions[i] > width-dropletRaduis) { 
            xPositions[i] = width-dropletRaduis 
            xVelocities[i] *= -bounceMult
        }

        if(yPositions[i] < dropletRaduis) { 
            yPositions[i] = dropletRaduis
            yVelocities[i] *= -bounceMult; 
        }
        else if(yPositions[i] > height-dropletRaduis) { 
            yPositions[i] = height-dropletRaduis
            yVelocities[i] *= -bounceMult
        }
        
        /* draw particle */
        ctx.drawImage(particleImg, 
            xPositions[i], yPositions[i],
            dropletRaduis, dropletRaduis
        );
    }
}

function reset(){
    for(let i=0; i<particleNum; i++){
        /* dam break? */
        xVelocities[i] = (Math.random()-.5)*2 * width * velMult
        yVelocities[i] = (Math.random()-.5)*2 * height * velMult
        xForces[i] = 0
        yForces[i] = 0
    } spacePressed = false
}

/* Events */
window.onkeydown= function(keyboardInput){
    if(keyboardInput.keyCode === 32) /* space bar */
        spacePressed = true
};
document.body.addEventListener("mousemove", (event) => {
    mouseVelX = event.x - mousePosX;
    mouseVelY = event.y - mousePosY;
    mousePosX = event.x
    mousePosY = event.y
});