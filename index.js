let hueOutput = 45;

let express = require('express');
let fs = require('fs');
let app = express();
// app.get('/', function (req, res) {
//   res.send('hello world')
// })
app.use('/', express.static('public'));

// let https = require('https');
// let server = https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app)
// .listen(443, function () {
//   console.log('Example app listening on port 3000! Go to https://localhost:443/')
// })

let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Server listening at port: ' + port);
});

let mqtt = require('mqtt');
// const { stringify } = require('querystring');
let client  = mqtt.connect('mqtt://169.254.122.202:1883');
 
client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt');
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

    socket.on('speaking', function(speaker) {
      console.log(speaker);
      if (speaker === 'evil') {
        client.publish('zigbee2mqtt/0x0017880109ceac0b/set', '{"color" : {"r":255,"g":0,"b":0}}', (err) => {
          if (err) {
            console.log(err);
          }
        });
        client.publish('zigbee2mqtt/0x0017880109ceafc8/set', '{"color" : {"r":255,"g":0,"b":0}}', (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
      if (speaker === 'good') {
        client.publish('zigbee2mqtt/0x0017880109ceac0b/set', '{"color" : {"r":0,"g":0,"b":255}}', (err) => {
          if (err) {
            console.log(err);
          }
        });
        client.publish('zigbee2mqtt/0x0017880109ceafc8/set', '{"color" : {"r":0,"g":0,"b":255}}', (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
      if (speaker === 'both') {
        client.publish('zigbee2mqtt/0x0017880109ceafc8/set', '{"color":{"r":255,"g":0,"b":0}}', (err) => {
          if (err) {
            console.log(err);
          }
        });
        client.publish('zigbee2mqtt/0x0017880109ceac0b/set', '{"color":{"r":0,"g":0,"b":255}}', (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });

    socket.on('scenechange', function(currentScene) {
      if (currentScene === 0) {
        client.publish('zigbee2mqtt/0x0017880109ceac0b/set', '{"brightness" : 254, "color":{"r":253,"g":244,"b":220}}');
        client.publish('zigbee2mqtt/0x0017880109ceafc8/set', '{"brightness" : 254, "color":{"r":253,"g":244,"b":220}}');
      }
      //scene for dimming light show start
      if (currentScene === 1) {
        client.publish('zigbee2mqtt/0x0017880109ceac0b/set', '{"brightness" : 1, "color":{"r":253,"g":244,"b":220}, "transition" : 5}');
        client.publish('zigbee2mqtt/0x0017880109ceafc8/set', '{"brightness" : 1, "color":{"r":253,"g":244,"b":220}, "transition" : 5}');
        setTimeout(() => {
          client.publish('zigbee2mqtt/0x0017880109ceafc8/set', '{"brightness" : 254, "color":{"r":255,"g":0,"b":0}}');
          client.publish('zigbee2mqtt/0x0017880109ceac0b/set', '{"brightness" : 254, "color":{"r":0,"g":0,"b":255}}');
        }, 5000)
      }
      if (currentScene === 2) {
        client.publish('zigbee2mqtt/0x0017880109ceac0b/set', '{"brightness" : 1, "color":{"r":253,"g":244,"b":220}, "transition" : 5}');
        client.publish('zigbee2mqtt/0x0017880109ceafc8/set', '{"brightness" : 1, "color":{"r":253,"g":244,"b":220}, "transition" : 5}');
      }
      console.log(currentScene);
    });
    
    // socket.on('scenechange', function(currentScene) { 
    //   console.log('scenechange received');
    //   if (currentScore != 0) {
    //     if (currentScore < 0) {
    //       let EvilScore = Math.abs(currentScore);
    //       let goodRed = 51 * EvilScore;
    //       let goodBlue = 255 - (51 * EvilScore);
    //       hueOutputGood = JSON.stringify({"r": goodRed, "g": 0, "b": goodBlue});
    //       hueOutputEvil = JSON.stringify({"r": 255, "g": 0, "b": 0});
    //     }
    //     else {
    //       let GoodScore = Math.abs(currentScore);
    //       let evilBlue = 51 * GoodScore;
    //       let evilRed = 255 - (51 * GoodScore);
    //       hueOutputGood = JSON.stringify({"r": 0, "g": 0, "b": 255});
    //       hueOutputEvil = JSON.stringify({"r": evilRed, "g": 0, "b": evilBlue});
    //     }
    //   }
    //   else {
    //     hueOutputGood = JSON.stringify({"r": 0, "g": 0, "b": 255});
    //     hueOutputEvil = JSON.stringify({"r": 255, "g": 0, "b": 0});
    //   }
    //   console.log('Good: ' + hueOutputGood);
    //   console.log('Evil: ' + hueOutputEvil);
    //   //GOOD
    //   client.publish('zigbee2mqtt/0x0017880109ceac0b/set', '{"color" : ' + hueOutputGood + ', "transition": 2}', (err) => {
    //     if (err) {
    //       console.log(err);
    //     }
    //   });
    //   //EVIL
    //   client.publish('zigbee2mqtt/0x0017880109ceafc8/set', '{"color" : ' + hueOutputEvil + ', "transition": 2}', (err) => {
    //     if (err) {
    //       console.log(err);
    //     }
    //   });
  //});
});

// client.publish('zigbee2mqtt/Switch1/set', '{"state": "TOGGLE"}');