const io = require('socket.io')();
io.on('connection', client => { 
     client.on('event', data => { console.log(data) });
client.on('disconnect', () => {console.log('disconecct') }); });
io.listen(3004);