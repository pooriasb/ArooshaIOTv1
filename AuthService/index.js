const request = require('request');
request.post({
    url: 'http://ippanel.com/api/select',
    body: {
        "op": "pattern",
        "user": "09928966092",
        "pass": "Faraz@2282094247",
        "fromNum": "3000505",
        "toNum": "09364587629",
        "patternCode": "kc6wd4eitrp9v5d",
        "inputData": [
            { "code": 6985 }
        ]
    },
    json: true,
}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE
        console.log(response.body);
    } else {
        console.log("whatever you want");
    }
});






