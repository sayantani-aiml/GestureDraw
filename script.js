const video=

document
.getElementById(
"video"
);

const canvas=

document
.getElementById(
"canvas"
);

const ctx=

canvas
.getContext(
"2d"
);

canvas.width=700;

canvas.height=500;

let drawing=false;

function clearCanvas(){

ctx.clearRect(

0,
0,
canvas.width,
canvas.height

);

}

const hands=

new Hands({

locateFile:
(file)=>

`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`

});

hands.setOptions({

maxNumHands:1,

modelComplexity:1,

minDetectionConfidence:
0.7,

minTrackingConfidence:
0.7

});

hands.onResults(

(results)=>{

if(

results.multiHandLandmarks

.length

){

document
.getElementById(
"status"
)

.innerText=

"🟢 Hand Found";

let hand=

results
.multiHandLandmarks[0];

let tip=

hand[8];

let x=

tip.x
*
canvas.width;

let y=

tip.y
*
canvas.height;

ctx.fillStyle=

document
.getElementById(
"colorPicker"
)

.value;

ctx.beginPath();

ctx.arc(

x,
y,
5,
0,
2*Math.PI

);

ctx.fill();

}

else{

document
.getElementById(
"status"
)

.innerText=

"🔴 No Hand";

}

}

);

const camera=

new Camera(

video,

{

onFrame:

async()=>{

await hands.send({

image:video

});

},

width:640,

height:480

}

);

camera.start();