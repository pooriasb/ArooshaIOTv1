const axios = require('axios');



const pingRequest = async (to) => {
  try {
    const response = await axios.get(to);
    if(response.data)
    return response.data;
    else return "no data recived";
  } catch (error) {
  
    return error.message; // Change the return value to suit your needs
  }
};



module.exports = {
    pingRequest
}