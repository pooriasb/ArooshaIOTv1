const express = require('express');


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
module.exports.createScheduleMessage = createScheduleMessage;