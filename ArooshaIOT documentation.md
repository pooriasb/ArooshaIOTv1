**ArooshaIOT documentation**

*1- micro service documentation*

1. ApiGateway{port : 3000}
2. MQTT service{port:3001}
3. SchedulerAndSenarioService {port : 3002}
4. DeviceAndTopicManagementService {port : 3003}
5. SocketService {port : 3004}
6. InfluxdbService {port: 3005}
7. EnergyManagementService {port:3006}
7. healthService {port:3007}
------------------------------------------------
Socket Coding
A : alive signal
S : Schedules

------------------------------------------
api list in api gate way
schedule.js:
CreateSchedule
getMyScheduleList

deviceController.js:
sendMessage
getMyDeviceList
GetMyRoomList
CreateDevice