const { InfluxDB } = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
const token = 'XKlWnw2A09WNqISlYUuprBH9WryaFg6L31dtpjJ0EtZ6wFXUy1tLvb3y5ET9Wy2cHxZDoMF6lubvAlK3HPqUZA=='
const org = 'Aroosha'
const bucket = 'Aroosha'



function saveAliveSignal(userId, MAC, HUE, RGBBrightness, ColorTemperature, Brightness, Dance) {


    const client = new InfluxDB({ url: 'http://154.211.2.176:8086', token: token })


    const { Point } = require('@influxdata/influxdb-client')
    const writeApi = client.getWriteApi(org, bucket)
    writeApi.useDefaultTags({ host: 'host1' })
    const point = new Point(userId)
        .stringField('MAC', MAC)
        .stringField('HUE', HUE)
        .intField('RGBBrightness', RGBBrightness)
        .intField('ColorTemperature', ColorTemperature)
        .intField('Brightness', Brightness)
        .intField('Dance', Dance)
        .tag('deviceID', MAC);

    writeApi.writePoint(point)
    writeApi
        .close()
        .then(() => {
            console.log('Alive Signal inserted')
        })
        .catch(e => {
            console.error(e)
            console.log('\\nFinished ERROR')
        })
}


module.exports.saveAliveSignal = saveAliveSignal;