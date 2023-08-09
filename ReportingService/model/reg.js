//const regression = require('regression');
// const data = [[1,1000],[2, 900] , [3, 1100], [4, 1050]];
// const result = regression.linear(data);
// const result1 = regression.exponential(data);
// const result2 = regression.logarithmic(data);
// console.log(result);
// console.log(result.predict(5));
// console.log(result1);
// console.log(result1.predict(5));
// console.log(result2);
// console.log(result2.predict(5));

// Import the required library


// // Preprocess the data
// const data = [
//   [1, 3],
//   [2, 5],
//   [3, 7],
//   [4, 9],
//   [5, 11],
//   [6, 11],
//   [7, 11],
// ];

// // Perform the logarithmic regression
// const result = regression.logarithmic(data);

// // Get the coefficients of the regression equation
// const a = result.equation[0];
// const b = result.equation[1];

// // Make predictions
// const x = 6;
// const y_pred = a * Math.log(x) + b;

// console.log("Predicted value:", y_pred);

// // Evaluate the model
// const y_actual = 13;
// const mse = (y_pred - y_actual) ** 2;
// const rmse = Math.sqrt(mse);
// const mae = Math.abs(y_pred - y_actual);

// console.log("Mean Squared Error:", mse);
// console.log("Root Mean Squared Error:", rmse);
// console.log("Mean Absolute Error:", mae);

// // Input data - time in minutes and energy consumption in watts for a house lamp
// const data = [
//     { time: 5, energy: 15 },
//     { time: 10, energy: 0 },
//     { time: 15, energy: 130 },
//     { time: 20, energy: 33 },
//     { time: 25, energy: 78 },
//     { time: 30, energy: 65 },
//     { time: 35, energy: 14 }
//     // Add more data points here...
// ];

// // Function to calculate logarithm base-10
// function log10(value) {
//     return Math.log(value) / Math.log(10);
// }

// // Calculate logarithmic regression coefficients
// let sumX = 0;
// let sumY = 0;
// let sumXY = 0;
// let sumX2 = 0;

// for (let i = 0; i < data.length; i++) {
//     const { time, energy } = data[i];

//     if (energy != 0) {
//         const logEnergy = log10(energy);
//         if (!isNaN(logEnergy)) { // Skip data points with energy 0
//             sumX += log10(time);
//             sumY += logEnergy;
//             sumXY += log10(time) * logEnergy;
//             sumX2 += log10(time) ** 2;
//         }
//     }
// }

// const n = data.length;
// const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
// const intercept = (sumY - slope * sumX) / n;

// // Function to predict energy consumption based on time
// function predictEnergy(time) {
//     return Math.round(10 ** (intercept + slope * log10(time)));
// }

// // Example usage
// const inputTime = 40; // Time in minutes
// const predictedEnergy = predictEnergy(inputTime, inputTime);

// console.log(`Predicted energy consumption at ${inputTime} minutes: ${predictedEnergy} watts`);




const CalculatePredictedEnergy = (data,inputTime) => {
    // Input data - time in minutes and energy consumption in watts for a house lamp
    // const data = [
    //     { time: 5, energy: 15 },
    //     { time: 10, energy: 0 },
    //     { time: 15, energy: 130 },
    //     { time: 20, energy: 33 },
    //     { time: 25, energy: 78 },
    //     { time: 30, energy: 65 },
    //     { time: 35, energy: 14 }
    //     // Add more data points here...
    // ];

    // Function to calculate logarithm base-10
    function log10(value) {
        return Math.log(value) / Math.log(10);
    }

    // Calculate logarithmic regression coefficients
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (let i = 0; i < data.length; i++) {
        const { time, energy } = data[i];

        if (energy != 0) {
            const logEnergy = log10(energy);
            if (!isNaN(logEnergy)) { // Skip data points with energy 0
                sumX += log10(time);
                sumY += logEnergy;
                sumXY += log10(time) * logEnergy;
                sumX2 += log10(time) ** 2;
            }
        }
    }

    const n = data.length;
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    const intercept = (sumY - slope * sumX) / n;

    // Function to predict energy consumption based on time
    function predictEnergy(time) {
        return Math.round(10 ** (intercept + slope * log10(time)));
    }


    //const inputTime = 40; // Time in minutes
    const predictedEnergy = predictEnergy(inputTime);

    console.log(`Predicted energy consumption at ${inputTime} minutes: ${predictedEnergy} watts`);
    return predictedEnergy

}


module.exports = {
    CalculatePredictedEnergy
}