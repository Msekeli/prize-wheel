document.addEventListener("DOMContentLoaded", function () {

  const countdownDiv = document.getElementById("countdown");
  const spinBtn = document.getElementById("spin-btn");

  // Function to update the countdown display
  const updateCountdown = (seconds) => {
    if (seconds > 0) {
      countdownDiv.style.display = 'block';
      countdownDiv.innerHTML = `<h2>Next valid spin in ${seconds} seconds</h2>`;
    } else {
      countdownDiv.style.display = 'none';
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

  if (remainingSeconds >= 0) {
    startCountdown(remainingSeconds);
  } else {
    spinBtn.disabled = false;
  }
});

// Function to check if it's an odd-numbered minute
const isOddMinute = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  return minutes % 2 !== 0;
  spinBtn.disabled = true;
};

// Disable the spin button on odd-numbered minutes
if (isOddMinute()) {
  const spinBtn = document.getElementById("spin-btn"); // define spinBtn
  spinBtn.disabled = true;
}

let isZero = false;

// Function to check seconds
const secondsCheck = () => {
  const nowSeconds = new Date();
  const seconds = nowSeconds.getSeconds();
  if (seconds == 0) {
    updateWheelValues();
    messageBox.innerHTML = `<p>Click the spin button to spin</p>`; 
  }
};

secondsCheck();

setInterval(secondsCheck, 1000);