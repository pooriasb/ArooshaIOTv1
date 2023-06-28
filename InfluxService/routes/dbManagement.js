const { InfluxDB } = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
const token = 'XKlWnw2A09WNqISlYUuprBH9WryaFg6L31dtpjJ0EtZ6wFXUy1tLvb3y5ET9Wy2cHxZDoMF6lubvAlK3HPqUZA=='
const org = 'Aroosha'
const bucket = 'Aroosha'



// Try to connect to InfluxDB



function saveAliveSignal(userId, mac, hue, rgbBrightness, colorTemperature, brightness, dance) {

    const client = new InfluxDB({ url: 'http://154.211.2.176:8086', token: token })


    const { Point } = require('@influxdata/influxdb-client');
    const writeApi = client.getWriteApi(org, bucket);
    //writeApi.useDefaultTags({ host: 'host1' })
    const point = new Point(userId)
        .stringField('deviceID', mac)
        .tag('hue', hue)
        .tag('rgbBrightness', rgbBrightness)
        .tag('colorTemperature', colorTemperature)
        .tag('brightness', brightness)
        .tag('dance', dance);


    writeApi.writePoint(point)
    writeApi
        .close()
        .then(() => {
            console.log('Alive Signal inserted mac:'+mac)
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
  try {
    const queryApi = new InfluxDB({ url: 'http://154.211.2.176:8086', token: token }).getQueryApi(org);
    const fluxQuery = `from(bucket: "Aroosha")
        |> range(start: ${start})
        |> filter(fn: (r) => r._value == "${mac}")
        |> group(columns: ["_measurement"], mode:"by")
        |> keep(columns: ["_time", "_field", "rgbBrightness", "colorTemperature" , "brightness"])
      `;

    const resultArray = await queryApi.collectRows(fluxQuery);

    return resultArray;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}











// async function getSignalByMac(mac, start) {
//   try {
//     const queryApi = new InfluxDB({ url: 'http://154.211.2.176:8086', token: token }).getQueryApi(org);
//     const pageSize = 1000; // Adjust the page size as per your requirement
//     let pageNumber = 1;
//     let resultArray = [];
    
//     while (true) {
//       const fluxQuery = `from(bucket: "Aroosha")
//         |> range(start: ${start})
//         |> filter(fn: (r) => r._value == "${mac}")
//         |> group(columns: ["_measurement"], mode:"by")
//         |> keep(columns: ["_time", "_field", "rgbBrightness", "colorTemperature", "brightness"])
//         |> limit(n: ${pageSize})
//         |> offset(n: ${(pageNumber - 1) * pageSize})
//       `;

//       const rows = await queryApi.collectRows(fluxQuery);
//       if (rows.length === 0) {
//         break; // Exit loop if no more rows are returned
//       }
//       resultArray = resultArray.concat(rows);

//       pageNumber++;
//     }

//     return resultArray;
//   } catch (error) {
//     console.error(error.message);
//     return [];
//   }
// }

module.exports.getSignalByMac = getSignalByMac;
module.exports.saveAliveSignal = saveAliveSignal;
module.exports.getData = getData;