
const axios = require('axios');

function createScheduleMessage(messages) {
    for (const key in messages) {
        for (let i = 0; i < messages[key].length; i++) {
            const { deviceMac, eventid: eventId } = messages[key][i];
            //   ServerPub.sendData(key, `Device Mac: ${deviceMac}, Event Id: ${eventId}`);
            return { room: key, mac: deviceMac, eventId: eventId };
        }
    }
   // console.log('Recived Message :' + JSON.stringify(data));
}

function sendAliveSignalToinfluxService(userId,MAC,HUE,RGBBrightnes,ColorTemperature,Brightness,Dance){


// Required Data in POST Request Body
const data= {
  userId: userId,
  MAC: MAC,
  HUE: HUE,
  RGBBrightnes: RGBBrightnes,
  ColorTemperature: ColorTemperature,
  Brightness: Brightness,
  Dance: Dance
};

// Send POST Request to the API Route
axios.post('http://localhost:3005/Alive', data)
  .then(function (response) {
    console.log('Request successful');
  })
  .catch(function (error) {
    console.log('Request failed!');
  });

}


module.exports.sendAliveSignalToinfluxService = sendAliveSignalToinfluxService;
module.exports.createScheduleMessage = createScheduleMessage;