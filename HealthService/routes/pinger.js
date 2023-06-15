const axios = require('axios');

const pingRequest = async (to) => {


var response = await axios.get(to);
return response;
};



module.exports = {
    pingRequest
}