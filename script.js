document.addEventListener("DOMContentLoaded", function () {
  const countdownDiv = document.getElementById("countdown");
  const spinBtn = document.getElementById("spin-btn");

  // Function to update the countdown display
  const updateCountdown = (seconds) => {
    if (seconds > 0) {
      countdownDiv.innerHTML = `<h2>Next valid spin in ${seconds} seconds</h2>`;
    } else {
      countdownDiv.innerHTML = `<h2>You may spin the wheel!</h2>`;
      spinBtn.disabled = false;
    }
  };

  // Function to start the countdown
  const startCountdown = (remainingSeconds) => {
    let countdownInterval = setInterval(() => {
      updateCountdown(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(countdownInterval);
      }

      remainingSeconds--;
    }, 1000);
  };

  // Function to calculate the remaining seconds until the next even-numbered minute using day.js
  const calculateRemainingSeconds = () => {
    const currentTime = dayjs(); // Use the current time from day.js
    const currentMinute = currentTime.minute();
    const isOddMinute = currentMinute % 2 !== 0;

    if (isOddMinute) {
      const currentSecond = currentTime.second();
      const secondsInMinute = 60;
      const secondsUntilNextEvenMinute = (secondsInMinute - (currentSecond % secondsInMinute)) % secondsInMinute;
      return secondsUntilNextEvenMinute;
    } else {
      return 0; // If it's an even-numbered minute, no need to display countdown
    }
  };

  // Fetch the initial countdown and start it
  const remainingSeconds = calculateRemainingSeconds();
  updateCountdown(remainingSeconds);

  if (remainingSeconds > 0) {
    startCountdown(remainingSeconds);
  } else {
    spinBtn.disabled = false;
  }
});


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
const labels = '';
let data = '';  

var pieColors = [
  "#9336B4", "#DA70D6",
];

let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: labels,
    datasets: [
      {
        backgroundColor: pieColors,
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

const valueGenerator = (angleValue, wheelData) => {
  for (let i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      const wonAmount = wheelData[i.value];
      finalValue.innerHTML = `<p>Congratulations! You won $${wonAmount}</p>`;
      break;
    }
  }
};

let count = 0;
let resultValue = 101;

// Function to update the wheel with values from the API
const updateWheelValues = async () => {
  await getWheelValues();
  finalValue = document.getElementById("final-value");
  myChart.data.labels = data;
  myChart.update();
};

// Function to get wheel values from the API
const getWheelValues = async () => {
  try {
    const response = await fetch('http://localhost:7071/api/getwheelvalues', {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      },
    });
    data = await response.json();

    if (data && data.message) {
      finalValue.innerHTML = `<p>${data.message}</p>`;
    }
  } catch (error) {
    console.error(error);
  }
};
// Call the update function on page load
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
let isZero = false;
// Function to check seconds
const secondsCheck = () => {
  const nowSeconds = new Date();
  const seconds = nowSeconds.getSeconds();
  if (seconds == 0) {
    updateWheelValues();
    finalValue.innerHTML = `<p>Click On The Spin Button To Start</p>`;
  }
};
secondsCheck;

spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Let's Go!</p>`;

  let randomDegree = 50;
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
    }
  }, 10);
});

setInterval(secondsCheck, 1000);
