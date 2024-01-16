// main.js
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
const data = '';
var pieColors = [
  "#9336B4","#DA70D6",
];

let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: data,
    datasets: [
      {
        backgroundColor: pieColors,
        data: [60, 60, 60, 60, 60, 60],
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

const valueGenerator = (angleValue, data) => {
  for (let i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      const wonAmount = data[i.value]; 
      finalValue.innerHTML = `<p>Congratulations! You won $${wonAmount}</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};

let count = 0;
let resultValue = 101;

const normalizeData = (data) => {
  const total = data.reduce((acc, value) => acc + value, 0);
  return data.map(value => (value / total) * 100);
};

spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Let's Go!</p>`;

  async function getWheelValues() {
    try {
      const response = await fetch('http://localhost:7071/api/getwheelvalues', {
        method: 'get',
        headers: {
          'content-type': 'application/json',
        },
      });
      const data = await response.json();

      myChart.data.labels = data;
      myChart.update();

      if (data && data.message) {
        finalValue.innerHTML = `<p>${data.message}</p>`;
      }
    } catch (error) {
      console.error(error);
    }
  }

  getWheelValues().then(() => {
    let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
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
});

// export function secondsCountdown() {
// 	var timeRemaining = new Date(Elements.remainingSeconds * 1000);
// 	var hours = timeRemaining.getUTCHours();
// 	var minutes = timeRemaining.getUTCMinutes();
// 	var seconds = timeRemaining.getSeconds();

// 	var timeString =
// 		hours.toString().padStart(2, '0') +
// 		'h' +
// 		minutes.toString().padStart(2, '0') +
// 		'm' +
// 		seconds.toString().padStart(2, '0') +
// 		's';

// 	Elements.BTN_SPIN.innerHTML = 'Next Spin in: ' + timeString;
// 	Elements.remainingSeconds--;
// }