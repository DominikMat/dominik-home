/* Canvas data */
let canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d")
let width = canvas.width = window.innerWidth*.95
let height = canvas.height = window.innerHeight*.95

/* constant data */
const pointWidth = 6
const pointHeight = 4
const pointNum = pointWidth * pointHeight;
const springInitLength = 68
const pointRad = 20
const gravity = 10
const bounceMult = 1
const deltaTime = 0.01

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

/* spring data */
const springNum = 4*(pointWidth-1)*(pointHeight-1) + pointWidth+pointHeight
const stiffness = 68
const damping = .005
let springIx1 = []
let springIx2 = []
let restingDists = []

/* mouse data */
const mouseEffectRad = springInitLength*pointWidth*.5
const mouseEffectMult = 2
const mouseDragMult = .1
let mousePosX = 0, mouseVelX = 0
let mousePosY = 0, mouseVelY = 0
let mousePressed = false

/* Initialization */
function init(){
    reset()

    /* init springs */
    let springInitNum = 0
    for(let x=0; x<pointWidth; x++)
        for(let y=0; y<pointHeight; y++){
            if(x<pointWidth-1 && y<pointHeight-1){
                /* spring to right */
                springIx1[springInitNum] = y*pointWidth+x
                springIx2[springInitNum] = y*pointWidth+(x+1)
                springInitNum++
                /* spring to down */
                springIx1[springInitNum] = y*pointWidth+x
                springIx2[springInitNum] = (y+1)*pointWidth+x
                springInitNum++
                /* spring diagonal */
                springIx1[springInitNum] = y*pointWidth+x
                springIx2[springInitNum] = (y+1)*pointWidth+(x+1)
                springInitNum++
                /* spring diagonal2 */
                springIx1[springInitNum] = (y+1)*pointWidth+x
                springIx2[springInitNum] = y*pointWidth+(x+1)
                springInitNum++
            } else if(x<pointWidth-1){
                /* spring right */
                springIx1[springInitNum] = y*pointWidth+x;
                springIx2[springInitNum] = y*pointWidth+(x+1);
                springInitNum++
            } else if(y<pointHeight-1){
                /* spring to down */
                springIx1[springInitNum] = y*pointWidth+x;
                springIx2[springInitNum] = (y+1)*pointWidth+x;
                springInitNum++
            }
        }

    for(let i=0; i<springNum; i++)
        restingDists[i] = dist(springIx1[i],springIx2[i])

    setInterval(loop,1000*deltaTime)
}

function reset(){
    /* square time */
    let squareWidth = (pointWidth-1)*springInitLength
    let squareHeight = (pointWidth-1)*springInitLength
    for(let x=0; x<pointWidth; x++)
        for(let y=0; y<pointHeight; y++){
            xPositions[y*pointWidth+x] = .5*(width - squareWidth) + x*springInitLength
            yPositions[y*pointWidth+x] = .5*(height - squareHeight) + y*springInitLength
        }

    /* vel reset */
    for(let i=0; i<pointNum; i++){
        xVelocities[i] = yVelocities[i] = 0
        xForces[i] = yForces[i] = 0
    }

    spacePressed = false
}

/* Simulation */
function loop(){
    if(spacePressed) reset()
    calcSpringForces()
    playerInput();
    apply()
    render()
}
function calcSpringForces(){
    for(let i=0; i<springNum; i++){
        /* data */
        let dirX = xPositions[springIx2[i]] - xPositions[springIx1[i]]
        let dirY = yPositions[springIx2[i]] - yPositions[springIx1[i]]
        let velDiffX = xVelocities[springIx2[i]] - xVelocities[springIx1[i]]
        let velDiffY = yVelocities[springIx2[i]] - yVelocities[springIx1[i]]
        let dist = Math.sqrt(Math.pow(dirX,2)+Math.pow(dirY,2))

        /* damping */
        let dotProduct = dot(dirX,dirY,velDiffX,velDiffY)
        let dampingX = dirX * damping * dotProduct
        let dampingY = dirY * damping * dotProduct

        /* Hooke's law */
        let springForceX = (dirX * stiffness * (dist-restingDists[i])) + dampingX
        let springForceY = (dirY * stiffness * (dist-restingDists[i])) + dampingY

        /* apply forces */
        xVelocities[springIx1[i]] += springForceX*deltaTime
        yVelocities[springIx1[i]] += springForceY*deltaTime
        xVelocities[springIx2[i]] += -springForceX*deltaTime
        yVelocities[springIx2[i]] += -springForceY*deltaTime
    }

    /* gravity */
    for(let i=0; i<pointNum; i++)
        yVelocities[i] += gravity
}
function playerInput(){
    for(let i=0; i<pointNum; i++){
        if(!mousePressed && mouseDist(i) < mouseEffectRad){
            xVelocities[i] += mouseVelX * mouseEffectMult
            yVelocities[i] += mouseVelY * mouseEffectMult
        } else if(mousePressed){
            xVelocities[i] += (mousePosX - xPositions[i]) * mouseDragMult
            yVelocities[i] += (mousePosY - yPositions[i]) * mouseDragMult
        } 
    }
}
function apply(){
    for(let i=0; i<pointNum; i++){
        /* euler explicit */
        xVelocities[i] += xForces[i] * deltaTime
        yVelocities[i] += yForces[i] * deltaTime
        xPositions[i] += xVelocities[i] * deltaTime
        yPositions[i] += yVelocities[i] * deltaTime

        /* bounds contraints */
        if(xPositions[i] > width-pointRad) { xPositions[i] = width-pointRad; xVelocities[i] *= -bounceMult; }
        if(xPositions[i] < pointRad) { xPositions[i] = pointRad; xVelocities[i] *= -bounceMult; }
        if(yPositions[i] > height-pointRad) { yPositions[i] = height-pointRad; yVelocities[i] *= -bounceMult; }
        if(yPositions[i] < pointRad) { yPositions[i] = pointRad; yVelocities[i] *= -bounceMult; }
    }
}
function render(){
    /* reset canvas*/
    ctx.fillStyle = "grey"
    ctx.fillRect(0,0,width,height)

    /* springs */
    ctx.lineWidth = 3
    for(let i=0; i<springNum; i++){
        ctx.beginPath()
        ctx.moveTo(xPositions[springIx1[i]]+pointRad*.5, yPositions[springIx1[i]]+pointRad*.5)
        ctx.lineTo(xPositions[springIx2[i]]+pointRad*.5, yPositions[springIx2[i]]+pointRad*.5)
        ctx.stroke()
    }
    
    /* particles */
    let avgX = 0, avgY = 0
    for(let i=0; i<pointNum; i++){
        ctx.drawImage(particleImg,xPositions[i], yPositions[i], pointRad, pointRad);   
        avgX += xPositions[i]; avgY += yPositions[i]
    }

    /* render mouse effect */
    if(mousePressed){
        ctx.beginPath()
        ctx.moveTo(avgX/pointNum, avgY/pointNum)
        ctx.lineTo(mousePosX,mousePosY)
        ctx.stroke()
    }
}

/* Utility */
function dist(ix1,ix2){
    let distX = (xPositions[ix2] - xPositions[ix1])
    let distY = (yPositions[ix2] - yPositions[ix1])
    let dist = Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2))
    return dist
}
function mouseDist(ix){
    let mouseDistX = (mousePosX - xPositions[ix])
    let mouseDistY = (mousePosY - yPositions[ix])
    let mouseDist = Math.sqrt(Math.pow(mouseDistX,2)+Math.pow(mouseDistY,2))
    return mouseDist
}
function dot(x1,y1,x2,y2){
    return x1*x2 + y1*y2
}

/* Events */
window.onload = () => { init(); }
document.addEventListener("mousedown", onMouseMoved);
document.addEventListener("mousemove", onMouseMoved);
document.addEventListener("mouseup", onMouseMoved);
document.addEventListener("mouseup", onMouseMoved);
window.onkeydown= function(keyboardInput){
    if(keyboardInput.keyCode === 32) /* space bar */
        spacePressed = true
};
function onMouseMoved(event){
    mouseVelX = event.x - mousePosX
    mouseVelY = event.y - mousePosY
    mousePosX = event.x
    mousePosY = event.y
    mousePressed = (event.buttons & 1) === 1;
}
