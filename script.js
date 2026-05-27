const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 700;
canvas.height = 500;

let prevX = null;
let prevY = null;
let mode = "pause";

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 👉 Finger count
function countFingers(hand) {
    let count = 0;
    let tips = [8, 12, 16, 20];

    for (let tip of tips) {
        if (hand[tip].y < hand[tip - 2].y) count++;
    }

    return count;
}

const hands = new Hands({
    locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});

hands.onResults((results) => {

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {

        let hand = results.multiHandLandmarks[0];
        let fingerCount = countFingers(hand);

        // 👉 Gesture logic
        if (fingerCount === 1) {
            mode = "draw";
            document.getElementById("status").innerText = "✏️ Draw";
        }
        else if (fingerCount >= 4) {
            mode = "erase";
            document.getElementById("status").innerText = "🧽 Erase";
        }
        else if (fingerCount === 0) {
            mode = "pause";
            document.getElementById("status").innerText = "✋ Pause";
        }

        let tip = hand[8];
        let x = tip.x * canvas.width;
        let y = tip.y * canvas.height;

        let color = document.getElementById("colorPicker").value;
        let size = document.getElementById("brushSize").value;

        if (mode === "draw") {

            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.lineCap = "round";

            // ✨ neon glow
            ctx.shadowColor = color;
            ctx.shadowBlur = 15;

            if (prevX && prevY) {
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.stroke();
            }

            prevX = x;
            prevY = y;
        }

        else if (mode === "erase") {
            ctx.clearRect(x - 15, y - 15, 30, 30);
            prevX = null;
            prevY = null;
        }

        else {
            prevX = null;
            prevY = null;
        }

    } else {
        document.getElementById("status").innerText = "🔴 No Hand";
        prevX = null;
        prevY = null;
    }

});

const camera = new Camera(video, {
    onFrame: async () => {
        await hands.send({ image: video });
    },
    width: 640,
    height: 480
});

camera.start();