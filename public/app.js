console.log('hello world');

let video;
let videoWidth = 0;
let videoHeight = 0;
let Canvas;
let currentScene = 0;
let windowLoaded = false;
let micOpen = false;

const mic = new Tone.UserMedia();

mic.output._unmutedVolume = 10;
console.log(mic);
const panner = new Tone.Panner(0).toDestination();
const dist = new Tone.Distortion();
dist._distortion = 0;
const pitchShift = new Tone.PitchShift();
pitchShift.pitch = 0;
const reverb = new Tone.Reverb(0.5);
mic.connect(pitchShift);
pitchShift.connect(dist);
dist.connect(reverb);
reverb.connect(panner);

window.addEventListener('load', () => {
    // const synth = new Tone.MembraneSynth().toDestination();
    socket.emit('scenechange', currentScene);
    windowLoaded = true;
    document.getElementById('button').addEventListener('click', () => {
        if (micOpen) {
            micOpen = false;
            // mic.close();
            console.log('mic closed')
        } else {
            micOpen = true;
            Tone.context.resume();
            mic.open().then(() => {
                // promise resolves when input is available
                console.log("mic open");
                // print the incoming mic levels in decibels
            }).catch(e => {
                // promise is rejected when the user doesn't have or allow mic access
                console.log("mic not open");
            });

            // mic.context.resume();
            // console.log(mic);
            // mic.open();
            console.log('mic open')
        }
        
    });
});

function keyPressed() {
    if (windowLoaded) {
        console.log('key pressed');
        if (keyCode === LEFT_ARROW && currentScene > -5) {
            currentScene -= 1;
            socket.emit('scenechange', currentScene);
            console.log('scene ' + currentScene);
        }
        if (keyCode === RIGHT_ARROW && currentScene < 5) {
            currentScene += 1;
            socket.emit('scenechange', currentScene);
            console.log('scene ' + currentScene);
        }
        //Press a
        if (keyCode === 65) {
            console.log('a was pressed');
            panner.pan.rampTo(-1, 0);
            dist._distortion = 0;
            reverb._decay = 2;
            // console.log(dist);
            console.log(reverb);
            // console.log(panner);
            pitchShift.pitch = 5;
            let speaker = 'good';
            socket.emit('speaking', speaker);
        }
        //Press d
        if (keyCode === 68) {
            console.log('d was pressed');
            panner.pan.rampTo(1, 0);
            dist._distortion = 1;
            reverb._decay = 2;
            // console.log(panner);
            console.log(dist);
            pitchShift.pitch = -5;
            let speaker = 'evil';
            socket.emit('speaking', speaker);
        }
        if (keyCode === 83) {
            console.log('s was pressed');
            panner.pan.rampTo(0, 0);
            dist._distortion = 0;
            pitchShift.pitch = 0;
            reverb._decay = 0;
            // console.log(panner);
            let speaker = 'both';
            socket.emit('speaking', speaker);
        }
    }
}


function setup() {
    videoWidth = document.getElementById('videoCaptureDiv').offsetWidth;
    videoHeight = document.getElementById('videoCaptureDiv').offsetHeight;
    console.log(videoWidth, videoHeight);
    Canvas = createCanvas(videoWidth, videoHeight);
    Canvas.parent('videoCaptureDiv');
    video = createCapture(VIDEO);
    video.hide();
}

function draw() {
    image(video, 0, 0, width, height);
}

function windowResized() {
    videoWidth = document.getElementById('videoCaptureDiv').offsetWidth;
    videoHeight = document.getElementById('videoCaptureDiv').offsetHeight;
    resizeCanvas(videoWidth, videoHeight);
}