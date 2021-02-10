console.log('hello world');

let poseNet;
let pose;
let video;
let videoWidth = 0;
let videoHeight = 0;
let Canvas;
let buttonPressed = true;

window.addEventListener('load', () => {
    document.getElementById('button').addEventListener('click', () => {
        console.log('button pushed');
        socket.emit('button', buttonPressed);
    });
});

function setup() {
    videoWidth = document.getElementById('videoCaptureDiv').offsetWidth;
    videoHeight = document.getElementById('videoCaptureDiv').offsetHeight;
    console.log(videoWidth, videoHeight);
    Canvas = createCanvas(videoWidth, videoHeight);
    Canvas.parent('videoCaptureDiv');

    video = createCapture(VIDEO, () => {
        console.log('user video captured');
    });
    video.hide();

    // Initialize poseNet
    poseNet = ml5.poseNet(video, () => {
        console.log('Model Ready');
    });
    poseNet.on('pose', (poses) => {
        if (poses.length > 0) {
            pose = poses[0].pose;
        }
    });
}

let hasClapped = false;
let counter = 0;
let limitation = 8;
let boundary = 550;

function draw() {
    if (pose) {
        image(video, 0, 0, videoWidth, videoHeight);
        let handDistance = dist(pose.rightWrist.x, pose.rightWrist.y, pose.leftWrist.x, pose.rightWrist.y);
        // console.log(handDistance);
        // let currentTime = millis();
        // let adjustedTime = floor(currentTime);
        // console.log(counter, handDistance);
        // console.log(handDistance);
        // let dividend = floor(handDistance/limitation);
        // if (handDistance <= boundary && counter % dividend == 0) {
        //     socket.emit('button', buttonPressed);
        //     console.log('button pushed');
        // }
        // if (handDistance <= 100 && counter % 6 == 0) {
        //     socket.emit('button', buttonPressed);
        //     console.log('button pushed');
        // }
        if (handDistance <= 50 && !hasClapped) {
            socket.emit('button', buttonPressed);
            console.log('button pushed');
            hasClapped = true;
        }
        if (handDistance >= 150 && hasClapped) {
            hasClapped = false;
            console.log('reset');
        }
        // ellipse(pose.rightWrist.x, pose.rightWrist.y, 50);
        // ellipse(pose.leftWrist.x, pose.leftWrist.y, 50);
        for (i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            ellipse(x, y, 24);
        }
    }
    counter++;
}

function windowResized() {
    videoWidth = document.getElementById('videoCaptureDiv').offsetWidth;
    videoHeight = document.getElementById('videoCaptureDiv').offsetHeight;
    resizeCanvas(videoWidth, videoHeight);
}