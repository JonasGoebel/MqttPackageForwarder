var mqtt=require('mqtt');
const dotenv = require('dotenv');
dotenv.config();

const listener = mqtt.connect(process.env.LISTENER_HOST, {clientId: process.env.LISTENER_CLIENTID, username: process.env.LISTENER_USER, password: process.env.LISTENER_PASSWORD});
const publisher = mqtt.connect(process.env.PUBLISHER_HOST,{clientId: process.env.PUBLISHER_CLIENTID, username: process.env.PUBLISHER_USER, password: process.env.PUBLISHER_PASSWORD});

listener.on('connect', () => {
    listener.subscribe(process.env.LISTENER_TOPIC);
    console.log("Client connected");
});

publisher.on('connect', () => {
  console.log("Publisher connected");
});

listener.on('message',function(topic, message){
    console.log("Listener received message in topic " + topic);
    var spTopic = topic.split('/')
    var msg = message.toString();

    if(!!JSON.parse(msg).payload_fields){
        publisher.publish(spTopic[0] + "/temperature/Value", "" + JSON.parse(msg).payload_fields.temperature);
        publisher.publish(spTopic[0] + "/temperature/Unit", "°C");
        publisher.publish(spTopic[0] + "/temperature/Label", "Temperatur FBS Projektraum");
        console.log(msg);
        console.log("================");
        console.log(JSON.parse(msg).payload_fields.temperature);
    } else {
        console.log('Got welcome message');
        console.log("================");
    }
});