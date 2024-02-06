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
let wheelValues = '';

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
      const wonAmount = "$" + wheelData[i.value];
      finalValue.innerHTML = `<p>Congratulations! You won ${wonAmount}</p>`;
      break;
    }
  }
};

let count = 0;
let resultValue = 101;

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
  finalValue = document.getElementById("final-value");
  myChart.data.labels = wheelValues;
  myChart.update();
};

// Function to get wheel values from the API
const getWheelValues = async () => {
  try {
    const response = await fetch('http://localhost:7071/api/prizewheel/getvalues', {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      }
    });
    wheelValues = await response.json();
    var values = wheelValues;
    console.log(wheelValues)

    if (wheelValues && wheelValues.message) {
      finalValue.innerHTML = `<p>${wheelValues.message}</p>`;
    }
  } catch (error) {
    console.error(error);
  }
};
//--------------------------------------------
// Function to spin the wheel
async function spinWheel() {
  try {
      const response = await fetch('http://localhost:7071/api/prizewheel/spin', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ wheelValues: wheelValues })
      });

      if (!response.ok) {
          throw new Error('Failed to spin the wheel');
      }
      //from spinwheel function
      const prizeValue = await response.json();

      console.log('Response Data:', prizeValue); 
      console.log('Picked Prize Value:', prizeValue); 

      return prizeValue;
      
  } catch (error) {
      console.error('Error spinning the wheel:', error);
  }
}

let promoAward;
// Function to handle button click event
document.getElementById("spin-btn").addEventListener("click", async function() {
    try {
        promoAward = await spinWheel();

        spinBtn.disabled = true;
        finalValue.innerHTML = `<p>Let's Go!</p>`;
        console.log("Promo award: "+ promoAward)
         // Call the spinWheel() function to initiate spinning
        console.log("Spinning... with ");
    } catch (error) {
        console.error('Error spinning the wheel:', error);
    }
});
// Call the update function on page load
updateWheelValues();
//-------------------------------------------------------
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
    finalValue.innerHTML = `<p>Please wait for the rigth time</p>`;
  }
};
secondsCheck;

spinBtn.addEventListener("click", () => {

  let prizeIndex = wheelValues.indexOf(promoAward) 
  let stopDegree = 50;
  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();
   
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = prizeIndex;
    
    }
console.log(prizeIndex);
    if (count > 15 && myChart.options.rotation >= stopDegree) {
      valueGenerator(stopDegree, wheelValues);
      count = 0;
      resultValue = 101;
      clearInterval(rotationInterval);
    }
  }, 10);
});

setInterval(secondsCheck, 1000);
