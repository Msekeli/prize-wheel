
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
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
  "#9336B4","#DA70D6",
];

let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: labels,
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
      console.log(data);
      console.log('won amount', wonAmount);
      finalValue.innerHTML = `<p>Congratulations! You won $${wonAmount}</p>`;
      // spinBtn.disabled = false;
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
      data = await response.json();

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
    console.log('stop degree: ', randomDegree);
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
