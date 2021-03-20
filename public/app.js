console.log('hello world');

let videoWidth = 0;
let videoHeight = 0;
let Canvas;
let mic;
let breathing = false;
let exhaleSent = true;
let threshold = 0.03;
let audio = false;
let actionSent = true;
let buttonPressed = true;

window.addEventListener('load', () => {
    document.getElementById('button').addEventListener('click', () => {
        console.log('button pushed');
        socket.emit('button', buttonPressed);
        userStartAudio();
        soundOut();
        audio = true;
    });
});

function setup() {
    videoWidth = document.getElementById('videoCaptureDiv').offsetWidth;
    videoHeight = document.getElementById('videoCaptureDiv').offsetHeight;
    console.log(videoWidth, videoHeight);
    Canvas = createCanvas(videoWidth, videoHeight);
    Canvas.parent('videoCaptureDiv');
    mic = new p5.AudioIn();
    mic.start();
}

function draw() {
        let soundLvl = mic.getLevel();
        console.log(soundLvl);
        // let soundLvlOutput = Math.floor(map(soundLvl, 0, 0.5, 0, 255, true));
        // socket.emit('soundLvl', soundLvlOutput);
        if (soundLvl < threshold && !exhaleSent) {
            //send exhale, set exhaleSent to true
            socket.emit('exhale', actionSent);
            exhaleSent = true;
        }
        if (soundLvl > threshold && exhaleSent) {
            //send inhale, set exhaleSent to false
            socket.emit('inhale', actionSent);
            exhaleSent = false;
        }
}

function windowResized() {
    videoWidth = document.getElementById('videoCaptureDiv').offsetWidth;
    videoHeight = document.getElementById('videoCaptureDiv').offsetHeight;
    resizeCanvas(videoWidth, videoHeight);
}