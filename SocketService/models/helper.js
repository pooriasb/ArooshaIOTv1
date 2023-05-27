const express = require('express');


function createScheduleMessage(data){
console.log('Recived Message :' + JSON.stringify(data));
}


module.exports.createScheduleMessage = createScheduleMessage;