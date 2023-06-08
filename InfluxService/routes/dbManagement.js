const { InfluxDB } = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
const token = 'XKlWnw2A09WNqISlYUuprBH9WryaFg6L31dtpjJ0EtZ6wFXUy1tLvb3y5ET9Wy2cHxZDoMF6lubvAlK3HPqUZA=='
const org = 'Aroosha'
const bucket = 'Aroosha'



function saveAliveSignal(userId, MAC, HUE, RGBBrightness, ColorTemperature, Brightness, Dance) {


    const client = new InfluxDB({ url: 'http://154.211.2.176:8086', token: token })


    const { Point } = require('@influxdata/influxdb-client')
    const writeApi = client.getWriteApi(org, bucket)
    //writeApi.useDefaultTags({ host: 'host1' })
    const point = new Point(userId)
        .stringField('deviceID', MAC)
        .tag('HUE', HUE)
        .tag('RGBBrightness', RGBBrightness)
        .tag('ColorTemperature', ColorTemperature)
        .tag('Brightness', Brightness)
        .tag('Dance', Dance);


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

function getData() {

    const queryApi = new InfluxDB({ url: 'http://154.211.2.176:8086', token: token }).getQueryApi(org)

    const fluxQuery = `from(bucket:"Aroosha") |> range(start: -20m) |> filter(fn: (r) => r._measurement == "Sajad")`

    // const fluxQuery2 = `from(bucket:"Aroosha") 
    //                  |> range(start: -10m)
    //                  |> filter(fn: (r) => r._measurement == "Sajad" and tag == "your_tag")`

    const myQuery = async () => {
        for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
            const objectFromTableMeta = tableMeta.toObject(values)
            console.log(objectFromTableMeta);
        }
    }
    /** Execute a query and receive line table metadata and rows. */
    myQuery()
}

async function getSignalByMac(mac, start) {
const queryApi = new InfluxDB({ url: 'http://154.211.2.176:8086', token: token }).getQueryApi(org)
const fluxQuery = `from(bucket: "Aroosha")
    |> range(start: ${start})
    |> filter(fn: (r) => r._value == "${mac}")
    |> group(columns: ["_measurement"], mode:"by")
    |> keep(columns: ["_time", "_field", "RGBBrightness", "ColorTemperature" , "Brightness"])`


    const resultArray = []

    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const objectFromTableMeta = tableMeta.toObject(values)
        resultArray.push(objectFromTableMeta)
    }
    return resultArray;
}

module.exports.getSignalByMac = getSignalByMac;
module.exports.saveAliveSignal = saveAliveSignal;
module.exports.getData = getData;