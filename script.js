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
    const response = await fetch('http://localhost:7071/api/prizewheel/getvalues', {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      }
    });
    wheelValues = await response.json();
    console.log('wheel values: ', wheelValues)

    if (wheelValues && wheelValues.message) {
      finalValue.innerHTML = `<p>${wheelValues.message}</p>`;
    }
  } catch (error) {
    console.error(error);
  }
};
// Function to update the wheel with values from the API
const updateWheelValues = async () => {
  await getWheelValues();
  finalValue = document.getElementById("final-value");
  myChart.data.labels = wheelValues;
  myChart.update();
};
// Call the update function on page load
updateWheelValues();

//--------------------------------------------===============================================================================----------------/////

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
setInterval(secondsCheck, 1000);
//-======================----------------------=============----------------------------==============================-----------
// Function to spin the wheel***************************************************
let prizeValue;
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
      prizeValue = await response.json();

      console.log('Picked Prize Value:', prizeValue); 

      return prizeValue;
      
  } catch (error) {
      console.error('Error spinning the wheel:', error);
  }
}

let awardAmountIndex; 
function findIndex(wheelValues, prizeValue) {
	for (let i = 0; i < wheelValues.length; i++) {
		if (wheelValues[i] === prizeValue) {
			awardAmountIndex = i + 1;
			console.log('%cawardAmountIndex', 'color: pink', awardAmountIndex);
			return awardAmountIndex;
		}
	}
	return 'Award Amount not found in Segments array!';
}

let stopDegree;

function calcStopDegree() {
	switch (awardAmountIndex) {
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
	console.log('%cstopdegree: ', 'color: yellow', stopDegree);
}


// Function to handle button click event
document.getElementById("spin-btn").addEventListener("click", async function() {
    try {
      prizeValue = await spinWheel();
      findIndex(wheelValues, prizeValue);
      calcStopDegree();

        spinBtn.disabled = true;
        finalValue.innerHTML = `<p>Let's Go!</p>`;

        // let stopDegree = 50;
        let rotationInterval = window.setInterval(() => {
        myChart.options.rotation = myChart.options.rotation + resultValue;
        myChart.update();
   
        if (myChart.options.rotation >= 360) {
          count += 1;
          resultValue -= 5;
          myChart.options.rotation = 0;
        
        }
      // console.log(prizeValue);
          if (count > 15 && myChart.options.rotation >= stopDegree) {
            valueGenerator(stopDegree);
            count = 0;
            resultValue = 101;
            clearInterval(rotationInterval);
          }
        }, 10);
              console.log("Promo award: "+ prizeValue)
              // Call the spinWheel() function to initiate spinning
              console.log("Spinning...");
          } catch (error) {
              console.error('Error spinning the wheel:', error);
          }
      });

let count = 0;
let resultValue = 101;

const valueGenerator = (stopDegree) => {
  for (let i of rotationValues) {
    if (stopDegree >= i.minDegree && stopDegree <= i.maxDegree) {
      finalValue.innerHTML = `<p>Congratulations! You won $${prizeValue}</p>`;
      break;
    }
  }
};

