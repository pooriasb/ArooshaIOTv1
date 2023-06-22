const axios = require('axios');



const pingRequest = async (to) => {
  try {
    const response = await axios.get(to);

    var result = {
      status: response.status,
      data: response.data
    }
    return result;

  } catch (error) {

    var result = {
      status: 500,
      data: error.message
    }
    return result;
  }
};



module.exports = {
  pingRequest
}