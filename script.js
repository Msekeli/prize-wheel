const wheel = document.getElementById("wheel");
let spinBtn = document.getElementById("spin-btn");
let finalValue = document.getElementById("message-box");

const rotationValues = [
  { minDegree: 0, maxDegree: 60, value: 0 },
  { minDegree: 61, maxDegree: 120, value: 1 },
  { minDegree: 121, maxDegree: 180, value: 2 },
  { minDegree: 181, maxDegree: 240, value: 3 },
  { minDegree: 241, maxDegree: 300, value: 4 },
  { minDegree: 301, maxDegree: 360, value: 5 }
];
const labels = '';
let wheelValues = '';

var pieColors = [
  "#9336B4", "#DA70D6",
];

// Function to generate a random GUID for userId
const generateRandomGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Function to get wheel values from the API
const getWheelValues = async () => {
  try {
    // Send a GET request to the API endpoint
    const response = await fetch('http://localhost:7071/api/prizewheel/getvalues', {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      }
    });
    // Parse the JSON response
    wheelValues = await response.json();
    // Log the fetched wheel values
    console.log('Response from GetWheelValuesFunction ', wheelValues)

    // If the response contains a message, update the HTML element with the id "finalValue"
    if (wheelValues && wheelValues.message) {
      finalValue.innerHTML = `<p>${wheelValues.message}</p>`;
    }
  } catch (error) {
    // Log any errors that occur during the process
    console.error(error);
  }
};

// Function to update the wheel with values from the API
const updateWheelValues = async () => {
  // Call the function to get wheel values
  await getWheelValues();
  // Get the HTML element with the id "message-box"
  finalValue = document.getElementById("message-box");
  // Update the data labels of the chart with the fetched wheel values
  myChart.data.labels = wheelValues;
  // Update the chart
  myChart.update();
};

// Call the update function on page load
updateWheelValues();

// Initialize Chart.js chart object
let myChart = new Chart(wheel, {
  // Configuration options for the chart
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: labels,
    datasets: [
      {
        backgroundColor: pieColors,
        data: [1, 1, 1, 1, 1, 1], // Default data
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: {
        display: false,
      },
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

// Function to spin the wheel and retrieve the prize value from the API
let prizeValue;
async function spinWheel() {
  try {
    // Send a POST request to spin the wheel
    const response = await fetch('http://localhost:7071/api/prizewheel/spin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ wheelValues: wheelValues })
    });
     // Extract the prize value from the response
     const prizeValue = await response.json();
    // If the response contains a message, update the HTML element with the id "finalValue"
    if (prizeValue && prizeValue.message) {
      finalValue.innerHTML = `<p>${prizeValue.message}</p>`;
    }
   
    // Log the picked prize value
    console.log('Response from the SpinWheelFunction:', prizeValue); 

    // Enable the spin button if a prize value exists
    if (prizeValue) {
      spinBtn.disabled = false;
    }

    // Return the prize value
    return prizeValue;
    
  } catch (error) {
    // Log any errors that occur during spinning the wheel
    console.error('Error spinning the wheel:', error);    
    return null;
  }
}

// Variable to store the index of the prize value in the wheelValues array
let prizeValueIndex; 

// Function to find the index of the prize value in the wheelValues array
function findIndex(wheelValues, prizeValue) {
	for (let i = 0; i < wheelValues.length; i++) {
		if (wheelValues[i] === prizeValue) {
			// If the prize value is found, set prizeValueIndex and log it
			prizeValueIndex = i + 1;
			console.log('%cprizeValueIndex', 'color: pink', prizeValueIndex);
			return prizeValueIndex;
		}
	}
	// If the prize value is not found, return a message
	return 'Award Amount not found in Segments array!';
}

// Variable to store the stop degree
let stopDegree;

// Function to calculate the stop degree based on the prizeValueIndex
function calcStopDegree() {
	switch (prizeValueIndex) {
		case 1:
			stopDegree = 325;
			break;
		case 2:
			stopDegree = 265;
			break;
		case 3:
			stopDegree = 205;
			break;
		case 4:
			stopDegree = 145;
			break;
		case 5:
			stopDegree = 85;
			break;
		case 6:
			stopDegree = 25;
			break;
	}
	// Log the calculated stop degree
	console.log("Stop degree is: " + stopDegree);
}

// Event listener for the button click event
document.getElementById("spin-btn").addEventListener("click", async function() {
  // Get a reference to the spin button
  const spinBtn = document.getElementById("spin-btn");
    try {
      // Spin the wheel and get the prize value
      prizeValue = await spinWheel();
    if(!prizeValue.message) {
            // Find the index of the prize value in the wheelValues array
      findIndex(wheelValues, prizeValue);
      // Calculate the stop degree based on the prizeValueIndex
      calcStopDegree();

      // Enable the spin button and display a message
      spinBtn.disabled = true;
      finalValue.innerHTML = `<p>Let's Go!</p>`;

      // Initialize variables for rotating the chart
      let rotationInterval = window.setInterval(() => {
        myChart.options.rotation = myChart.options.rotation + resultValue;
        myChart.update();
   
        // Check if the chart rotation exceeds 360 degrees
        if (myChart.options.rotation >= 360) {
          count += 1;
          resultValue -= 5;
          myChart.options.rotation = 0;
        }
      
        // Check if the rotation count exceeds 15 and the rotation reaches the stop degree
        if (count > 15 && myChart.options.rotation >= stopDegree) {
          // Determine the prize value based on the stop degree
          determinePrizeValue(stopDegree);
          count = 0;
          resultValue = 101;
          clearInterval(rotationInterval);
        }
      }, 10);

    }


    } catch (error) {
      // Log any errors that occur during spinning the wheel
      console.error('Error spinning the wheel:', error);
    }
});

// Variables for chart rotation control
let count = 0;
let resultValue = 101;

// Function to determine the prize value based on the stop degree
const determinePrizeValue = (stopDegree) => {
  for (let i of rotationValues) {
    if (stopDegree >= i.minDegree && stopDegree <= i.maxDegree) {
      // Display the prize value on the screen
      finalValue.innerHTML = `<p>Congratulations! You won $${prizeValue}</p>`;
      break;
    }
  }
};
