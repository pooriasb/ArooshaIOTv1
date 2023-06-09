
const axios = require('axios');
const config = require('config');
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

const sendAliveSignalToInfluxService = ({ userId, mac, hue,rgbBrightness, colorTemperature, brightness, dance }) => {
  // Required Data in POST Request Body
  const data = {
    userId,
    mac: mac,
    hue: hue,
    rgbBrightness: rgbBrightness,
    colorTemperature: colorTemperature,
    brightness: brightness,
    dance: dance
  };
  
  // Send POST Request to the API Route
  axios.post(`${config.InfluxAddress}/Alive`, data)
    .then(response => {
      console.log('Request successful');
    })
    .catch(error => {
      console.log(`Request failed! ${error.message}`);
    });
};



module.exports.sendAliveSignalToInfluxService = sendAliveSignalToInfluxService ;
module.exports.createScheduleMessage = createScheduleMessage;