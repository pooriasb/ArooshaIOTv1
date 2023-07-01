// Request
// URL: https://app.najva.com/notification/api/v1/notifications/
// HTTP-Method: POST
// HTTP-Headers:
// Content-Type: application/json
// Authorization: Token "<YOUR_TOKEN>"
// Body
// {
// "api_key": "<YOUR_API_KEY>",
// "subscriber_tokens": [TOKEN1, TOKEN2, ...],
// "title": "title",
// "body": "body",
// "onclick_action": "<YOUR_ACTION>",
// "url": "http://example.com",
// "content": "some content",
// "json":"{\"key\":\"value\"}",
// "icon": "https://images.pexels.com/photos/236047/pexels-photo-236047.jpeg?cs=srgb&dl=clouds-cloudy-countryside-236047.jpg&fm=jpg",
// "image": "https://images.pexels.com/photos/236047/pexels-photo-236047.jpeg?cs=srgb&dl=clouds-cloudy-countryside-236047.jpg&fm=jpg",
// "sent_time": "2019-01-07T12:00:00"
// }




const axios = require('axios');


function send() {

    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token "1e4ac148fce52a8e1ceffae066713a04261ec6f6"`
        }
    };
    var Body=
    {
    "api_key": "d0877ecb-941e-4e5a-9d76-30450ca363d7",
    "title": "title",
    "body": "body",
    "onclick_action": "open-link",
    "url": "https://mahoosoft.ir",
    "content": "some content",
    }
    axios.post('https://app.najva.com/api/v1/notifications/', Body, options)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });

}


send();