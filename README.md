- # Smart Lighting Platform for Internet of Things

  ## Description

  This project is a smart system for controlling and managing lighting in homes and buildings using the Internet of Things. With this project, you can:

  - Turn your lighting devices on and off or controll your light options such as RGB,Dimmer And etc remotely
  - Define different rooms and topics for your devices
  - Create different scenarios for your lighting
  - Schedule the on and off times of your devices
  - Manage and optimize your energy consumption
  - Receive useful reports about your lighting and energy usage

## How to install and run the project

To install and run the project, you need to have Node.js and MongoDB installed. You also need to have an MQTT service for sending and receiving messages from the devices. Then follow these steps:

- Download or clone the source code of the project from GitHub
- In the project folder, run the command `npm install` to install the dependencies
- Create a `.env` file with your desired settings. For example:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/Arooshaiot
JWT_SECRET=secret
```

- Run the command `npm start` to start the service
- Using a browser or Postman application, go to `http://localhost:3000`

## Dependencies

The project is built using the following technologies:

- Express.js: A web framework for Node.js
- MongoDB: A NoSQL database
- MQTT: A lightweight communication protocol for the Internet of Things
- Socket.io: A library for real-time bidirectional communication
- JWT: A standard for creating authentication tokens
- Node-cron: A library for scheduling tasks
- Load balancer: A technology for distributing the load of user requests among different servers

## License

```
This project is licensed under the Smart Lighting Platform for Internet of Things License - see the LICENSE.txt file for details.
```

## Contact

If you have any questions or suggestions, feel free to contact me at mr.sabooki@gmail.com.



