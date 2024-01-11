const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 2 },
  { minDegree: 31, maxDegree: 90, value: 1 },
  { minDegree: 91, maxDegree: 150, value: 6 },
  { minDegree: 151, maxDegree: 210, value: 5 },
  { minDegree: 211, maxDegree: 270, value: 4 },
  { minDegree: 271, maxDegree: 330, value: 3 },
  { minDegree: 331, maxDegree: 360, value: 2 },
];
const data = [16, 16, 16, 16, 16, 16];
var pieColors = [
  "#9336B4", 
];
let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: data,
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
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
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      const wonAmount = i.value * 10;
      finalValue.innerHTML = `<p>Congratulations! You won $${wonAmount}</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};
let count = 0;
let resultValue = 101;
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});

async function getWheelValues() {
  try {
    const response = await fetch('http://localhost:7071/api/getwheelvalues', {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      },
    });

    const data = await response.json();

    // Update the wheel data with the received values
    myChart.data.labels = data;
    myChart.data.datasets[0].data = data;
    myChart.update();

    // Display a message if needed (modify as per your response structure)
    if (data && data.message) {
      finalValue.innerHTML = `<p>${data.message}</p>`;
    }
  } catch (error) {
    console.error(error);
  }
}

// ... (your existing code)

spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Good Luck!</p>`;

  // Trigger the Azure Function call to get new wheel values
  getWheelValues()
    .then(() => {
      // Proceed with the spinning logic as before
      let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
      let rotationInterval = window.setInterval(() => {
        myChart.options.rotation = myChart.options.rotation + resultValue;
        myChart.update();
        if (myChart.options.rotation >= 360) {
          count += 1;
          resultValue -= 5;
          myChart.options.rotation = 0;
        } else if (count > 15 && myChart.options.rotation == randomDegree) {
          // Modify valueGenerator to use data from the backend
          valueGenerator(randomDegree, data);
          clearInterval(rotationInterval);
          count = 0;
          resultValue = 101;
        }
      }, 10);
    });
});

