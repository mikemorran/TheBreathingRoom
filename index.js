let express = require('express');
let app = express();
app.use('/', express.static('public'));

let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Server listening at port: ' + port);
});

let mqtt = require('mqtt');
const { stringify } = require('querystring');
let client  = mqtt.connect('mqtt://192.168.0.14:1883');
 
client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt');
      client.publish('zigbee2mqtt/0x0017880109ceac0b/set', '{"color":{"h":0,"s":100,"b":0}}');
      client.publish('zigbee2mqtt/0x0017880109ceafc8/set', '{"color":{"h":0,"s":100,"b":0}}');
    }
  });
});
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  // client.end();
});

let io = require('socket.io')(server);

// Listen for Individual Connection
io.sockets.on('connection', function(socket) {
    console.log ('New client: ' + socket.id);
    
    socket.on('button', function() {
        console.log('button message received');
        client.publish('zigbee2mqtt/0x0017880109ceac0b/set', '{"color":{"h":45,"s":100,"b":100}, "transition":1}', (err) => {
            console.log(err);
        });
        client.publish('zigbee2mqtt/0x0017880109ceafc8/set', '{"color":{"h":45,"s":100,"b":100}, "transition":1}', (err) => {
          console.log(err);
      });
    });

    // socket.on('soundLvl', (soundData) => {
    //   // console.log(soundData);
    //   if (soundData) {
    //     let brightnessOutput = JSON.stringify(soundData);
    //     console.log(brightnessOutput);
    //     client.publish('zigbee2mqtt/0x0017880109ceac0b/set', '{"color":{"h":45,"s":100,"b":'+ brightnessOutput +'}}', (err) => {
    //       console.log(err);
    //     });
    //     client.publish('zigbee2mqtt/0x0017880109ceafc8/set', '{"color":{"h":45,"s":100,"b":'+ brightnessOutput +'}}', (err) => {
    //       console.log(err);
    //     });
    //   }
    // })

    socket.on('inhale', () => {
      console.log('inhaling');
      client.publish('zigbee2mqtt/0x0017880109ceac0b/set', '{"brightness_move" : 250}', (err) => {
        console.log(err);
      });
      client.publish('zigbee2mqtt/0x0017880109ceafc8/set', '{"brightness_move" : 250}', (err) => {
        console.log(err);
      });
    })
    socket.on('exhale', () => {
      console.log('exhaling');
      client.publish('zigbee2mqtt/0x0017880109ceac0b/set', '{"brightness_move" : -150}', (err) => {
        console.log(err);
      });
      client.publish('zigbee2mqtt/0x0017880109ceafc8/set', '{"brightness_move" : -150}', (err) => {
        console.log(err);
      });
    })
});

// client.publish('zigbee2mqtt/Switch1/set', '{"state": "TOGGLE"}');