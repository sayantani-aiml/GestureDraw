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

canvas.width=600;

canvas.height=400;

let drawing=false;

let color=

document
.getElementById(
"colorPicker"
);

canvas
.addEventListener(

"mousedown",

start

);

canvas
.addEventListener(

"mouseup",

stop

);

canvas
.addEventListener(

"mousemove",

draw

);

function start(e){

drawing=true;

draw(e);

}

function stop(){

drawing=false;

ctx.beginPath();

}

function draw(e){

if(!drawing)
return;

ctx.lineWidth=5;

ctx.lineCap=
"round";

ctx.strokeStyle=

color.value;

ctx.lineTo(

e.offsetX,

e.offsetY

);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(

e.offsetX,

e.offsetY

);

}

function clearCanvas(){

ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);

}

function saveCanvas(){

let link=

document
.createElement(

"a"

);

link.download=

"airdrawing.png";

link.href=

canvas
.toDataURL();

link.click();

}