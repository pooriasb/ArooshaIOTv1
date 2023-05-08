const mqtt = require('mqtt');


var topic = 'SajadHome/#';


var client = mqtt.connect('mqtt://127.0.0.1:1883');
 client.on('connect', function () {
    client.subscribe(topic);
 console.log(`Device connected to broker and subscribed to ${topic}`);
});

client.on('message',function (topic,message){
console.log(message.toString() + '  topic:' + topic);
});



 setInterval(() => {
  client.publish('SajadHome/Room1', Date.now().toString());
  console.log(Date.now());
}, 1500);









client.on('reconnect', function () {
    console.log('Reconnecting...')
  });
  client.on('close', function () {
    console.log('Disconnected')
  });
  client.on('disconnect', function (packet) {
    console.log(packet);
    console.log('disconnected');
  });
client.on('error',(e)=>{
    console.log('Error');
});