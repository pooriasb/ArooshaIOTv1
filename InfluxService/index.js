const {InfluxDB} = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
const token = 'XKlWnw2A09WNqISlYUuprBH9WryaFg6L31dtpjJ0EtZ6wFXUy1tLvb3y5ET9Wy2cHxZDoMF6lubvAlK3HPqUZA=='
const org = 'Aroosha'
const bucket = 'Aroosha'

const client = new InfluxDB({url: 'http://154.211.2.176:8086', token: token})


const {Point} = require('@influxdata/influxdb-client')
const writeApi = client.getWriteApi(org, bucket)
writeApi.useDefaultTags({host: 'host1'})

const point = new Point('sajad')
 .stringField('MAC','test')
 .stringField('HUE','test')
 .intField('RGBBrightnes ',50)
 .intField('ColorTemperature  ',50)
 .intField('Brightness   ',50)
 .intField('Dance   ',0)

  
writeApi.writePoint(point)
writeApi
    .close()
    .then(() => {
        console.log('Alive signal inserted')
    })
    .catch(e => {
        console.error(e)
        console.log('\\nFinished ERROR')
    })


    