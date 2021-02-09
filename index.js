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
let client  = mqtt.connect('mqtt://192.168.0.14:1883');
 
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
    
    socket.on('button', function() {
        console.log('button message received');
        client.publish('zigbee2mqtt/Switch1/set', '{"state": "TOGGLE"}', (err) => {
            console.log(err);
        });
    });
});

// client.publish('zigbee2mqtt/Switch1/set', '{"state": "TOGGLE"}');