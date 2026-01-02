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
let spacePressed = false

/* constant data */
const particleNum = 3
const particleMass = 1000
const velMult = .4
//const bounceMult = 0.4
const deltaTime = 0.01
const dropletRaduis = 40

const gravitationalConstant = 1000
const velocityCap = 400
const middleMult = 0.1

const mouseEffectRad = 150
const mouseEffectMult = 2.5

let mousePosX = 0
let mousePosY = 0

/* Initialization */
window.onload = () => { init(); }
function init(){
    reset()
    setInterval(loop,1000*deltaTime)
}

/* Simulation */
function loop(){
    if(spacePressed) reset()
    forces()
    apply()
}

function forces(){
    /* Compute Forces */
    for(let p1=0; p1<particleNum; p1++){
        for(let p2=p1+1; p2<particleNum; p2++){
            if(p1==p2) continue;
            let dirX = (xPositions[p2] - xPositions[p1])
            let dirY = (yPositions[p2] - yPositions[p1])
            let dirLgth = Math.sqrt(dirX*dirX + dirY*dirY)
            dirX /= dirLgth; dirY /= dirLgth
            
            if(dirLgth >= dropletRaduis){
                xForces[p1] += dirX * gravitationalConstant * (particleMass*particleMass) / (dirLgth*dirLgth)
                yForces[p1] += dirY * gravitationalConstant * (particleMass*particleMass) / (dirLgth*dirLgth)
                xForces[p2] -= dirX * gravitationalConstant * (particleMass*particleMass) / (dirLgth*dirLgth)
                yForces[p2] -= dirY * gravitationalConstant * (particleMass*particleMass) / (dirLgth*dirLgth)
            }
        }
    }
}

function apply(){
    /* reset canvas*/
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,width,height)

    /* game loop */
    for(let i=0; i<particleNum; i++){
        /* euler explicit */
        xVelocities[i] += xForces[i]/particleMass * deltaTime -(xPositions[i]-width/2) * middleMult
        yVelocities[i] += yForces[i]/particleMass * deltaTime -(yPositions[i]-height/2) * middleMult
        xPositions[i] += xVelocities[i] * deltaTime
        yPositions[i] += yVelocities[i] * deltaTime

        /* velocity cap */
        let velMag = Math.sqrt(xVelocities[i]*xVelocities[i] + yVelocities[i]*yVelocities[i])
        if(velMag > velocityCap){
            xVelocities[i] *= velocityCap/velMag
            yVelocities[i] *= velocityCap/velMag
        }

        //const eps = width * 0.007

        // if(xPositions[i] < dropletRaduis) { 
        //     xPositions[i] = dropletRaduis+eps
        //     xVelocities[i] *= -bounceMult
        // }
        // else if(xPositions[i] > width-dropletRaduis) { 
        //     xPositions[i] = width-dropletRaduis-eps
        //     xVelocities[i] *= -bounceMult
        // }

        // if(yPositions[i] < dropletRaduis) { 
        //     yPositions[i] = dropletRaduis+eps
        //     yVelocities[i] *= -bounceMult; 
        // }
        // else if(yPositions[i] > height-dropletRaduis) { 
        //     yPositions[i] = height-dropletRaduis-eps
        //     yVelocities[i] *= -bounceMult
        // }
        
        /* draw particle */
        ctx.drawImage(particleImg, 
            xPositions[i], yPositions[i],
            dropletRaduis, dropletRaduis
        );
    }
}

function reset(){
    for(let i=0; i<particleNum; i++){
        xPositions[i] = Math.random() * width * .8
        yPositions[i] = Math.random() * height * .8
        xVelocities[i] = (Math.random()-.5)*2 * width * velMult
        yVelocities[i] = (Math.random()-.5)*2 * height * velMult
        xForces[i] = 0
        yForces[i] = 0
    } spacePressed = false;
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