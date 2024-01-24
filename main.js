const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
let finalValue = document.getElementById("final-value");
const rotationValues = [
  { minDegree: 0, maxDegree: 60, value: 0 },
  { minDegree: 61, maxDegree: 120, value: 1 },
  { minDegree: 121, maxDegree: 180, value: 2 },
  { minDegree: 181, maxDegree: 240, value: 3 },
  { minDegree: 241, maxDegree: 300, value: 4 },
  { minDegree: 301, maxDegree: 360, value: 5 }
];
let data = [];
let myChart;

// Function to initialize the wheel chart
const initializeWheel = () => {
  myChart = new Chart(wheel, {
    plugins: [ChartDataLabels],
    type: "pie",
    data: {
      labels: [],
      datasets: [
        {
          backgroundColor: ["#9336B4", "#DA70D6"],
          data: [1, 1, 1, 1, 1, 1],
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
};

// Function to generate a random GUID for userId
const generateRandomGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Function to update the wheel with values from the API
const updateWheelValues = async () => {
  await getWheelValues();
  finalValue.innerHTML = `<p>Click On The Spin Button To Start</p>`;
  myChart.data.labels = data;
  myChart.update();
};

// Function to get wheel values from the API
const getWheelValues = async () => {
  try {
    // Fetch data from GetWheelValues function
    const response = await fetch('http://localhost:7071/api/getwheelvalues', {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      },
    });
    const responseData = await response.json();

    if (responseData && responseData.message) {
      finalValue.innerHTML = `<p>${responseData.message}</p>`;
    } else {
      data = responseData;
    }
  } catch (error) {
    console.error(error);
  }
};

// Function to spin the wheel
const spinWheel = async () => {
  try {
    const userId = generateRandomGuid();

    // Make a request to the SpinWheel function with the generated userId
    const spinResponse = await fetch(`http://localhost:7071/api/spinwheel?userId=${userId}`, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      },
    });
    
    const spinResult = await spinResponse.json();

    if (spinResult && spinResult.Prize !== undefined) {
      finalValue.innerHTML = `<p>Congratulations! You won $${spinResult.Prize}</p>`;
    } else if (spinResult && spinResult.message) {
      finalValue.innerHTML = `<p>${spinResult.message}</p>`;
    }
  } catch (error) {
    console.error(error);
  }
};

// Call the update function on page load
initializeWheel();
updateWheelValues();

// Function to check if it's an odd-numbered minute
const isOddMinute = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  return minutes % 2 !== 0;
};

// Disable the spin button on odd-numbered minutes
if (isOddMinute()) {
  spinBtn.disabled = true;
}

// Function to check seconds
const secondsCheck = () => {
  const nowSeconds = new Date();
  const seconds = nowSeconds.getSeconds();
  if (seconds == 0) {
    updateWheelValues();
  }
};

setInterval(secondsCheck, 1000);

spinBtn.addEventListener("click", () => {
  // Enable the spin button
  spinBtn.disabled = false;
  finalValue.innerHTML = `<p>Let's Go!</p>`;

  let randomDegree = 50;
  let count = 0;
  let resultValue = 101;

  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();

    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    }

    if (count > 15 && myChart.options.rotation >= randomDegree) {
      valueGenerator(randomDegree, data);
      count = 0;
      resultValue = 101;
      clearInterval(rotationInterval);
      // Make a request to SpinWheel function when the wheel stops spinning
      spinWheel();
    }
  }, 10);
});
