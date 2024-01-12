// chart-config.js
const chartConfig = {
    wheel: document.getElementById("wheel"),
    spinBtn: document.getElementById("spin-btn"),
    finalValue: document.getElementById("final-value"),
    rotationValues: [
      { minDegree: 0, maxDegree: 30, value: 2 },
      { minDegree: 31, maxDegree: 90, value: 1 },
      { minDegree: 91, maxDegree: 150, value: 6 },
      { minDegree: 151, maxDegree: 210, value: 5 },
      { minDegree: 211, maxDegree: 270, value: 4 },
      { minDegree: 271, maxDegree: 330, value: 3 },
      { minDegree: 331, maxDegree: 360, value: 2 },
    ],
    data: [1, 1, 1, 1, 1, 1],
    pieColors: ["#9336B4","#BF40BF"],
  };
  
  let myChart = new Chart(chartConfig.wheel, {
    plugins: [ChartDataLabels],
    type: "pie",
    data: {
      labels: chartConfig.data,
      datasets: [
        {
          backgroundColor: chartConfig.pieColors,
          data: chartConfig.data,
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
    for (let i of chartConfig.rotationValues) {
      if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
        const wonAmount = data[i.value - 1];
        chartConfig.finalValue.innerHTML = `<p>Congratulations! You won $${wonAmount}</p>`;
        chartConfig.spinBtn.disabled = false;
        break;
      }
    }
  };
  