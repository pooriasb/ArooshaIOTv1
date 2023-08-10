
// const sampleData = [
//   {'time':1,'rgbBrightness': 100, 'rgbColor': '#1515213', 'colorTemperature': 100, 'brightness': 100, 'RGBDanceCode': '0'},
//   {'time':2,'rgbBrightness': 50, 'rgbColor': '#9090AB', 'colorTemperature': 75, 'brightness': 80, 'RGBDanceCode': '2'},
//   {'time':3,'rgbBrightness': 80, 'rgbColor': '#9090AB', 'colorTemperature': 90, 'brightness': 100, 'RGBDanceCode': '1'},
// ];

//rgbBrightness between 0 to 100
//rgbColor is hex of color
//colorTemperature between 0 to 100
//brightness between 0 to 100
//RGBDanceCode 0 = off , 1 = dance type 1 , 2 = dance type 2, 3 = dance type 3 

const tf = require('@tensorflow/tfjs-node');

// Define the input data and target variable
const input = tf.tensor2d([
  [100, 100, 100, 0], // [rgbBrightness, colorTemperature, brightness, RGBDanceCode] at time = 1
  [50, 75, 80, 2], // [rgbBrightness, colorTemperature, brightness, RGBDanceCode] at time = 2
  [80, 90, 100, 1], // [rgbBrightness, colorTemperature, brightness, RGBDanceCode] at time = 3
]);
const target = tf.tensor2d([
  [0], // RGBDanceCode at time = 4
]);

// Define the model architecture
const model = tf.sequential();
model.add(tf.layers.dense({ units: 32, inputShape: [4], activation: 'relu' }));
model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1 }));

// Compile and train the model
model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
model.fit(input, target, { epochs: 100 });

// Predict the RGBDanceCode at time = 4
const inputPredict = tf.tensor2d([
  [/* attributes at time = 1 */],
  [/* attributes at time = 2 */],
  [/* attributes at time = 3 */],
]);
const prediction = model.predict(inputPredict);
console.log(`Prediction: ${prediction.dataSync()[0]}`);