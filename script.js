const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 700;
canvas.height = 500;

let mode = "pause"; // draw / erase / pause

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

// 👉 Function to count raised fingers
function countFingers(hand) {
    let fingers = [];

    // Tip landmarks: 8, 12, 16, 20
    let tips = [8, 12, 16, 20];

    for (let i of tips) {
        if (hand[i].y < hand[i - 2].y) {
            fingers.push(1);
        } else {
            fingers.push(0);
        }
    }

    return fingers.reduce((a, b) => a + b, 0);
}

hands.onResults((results) => {

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {

        let hand = results.multiHandLandmarks[0];

        let fingerCount = countFingers(hand);

        // 👉 Detect gestures
        if (fingerCount === 1) {
            mode = "draw";
            document.getElementById("status").innerText = "✏️ Drawing Mode";
        }
        else if (fingerCount >= 4) {
            mode = "erase";
            document.getElementById("status").innerText = "🧽 Erase Mode";
        }
        else if (fingerCount === 0) {
            mode = "pause";
            document.getElementById("status").innerText = "✋ Pause";
        }

        // Index finger tip
        let tip = hand[8];
        let x = tip.x * canvas.width;
        let y = tip.y * canvas.height;

        if (mode === "draw") {
            ctx.fillStyle = document.getElementById("colorPicker").value;

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }

        else if (mode === "erase") {
            ctx.clearRect(x - 10, y - 10, 20, 20);
        }

        // pause → do nothing

    } else {
        document.getElementById("status").innerText = "🔴 No Hand";
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