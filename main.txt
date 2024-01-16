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
      myChart.data.datasets[0].data = data;
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
