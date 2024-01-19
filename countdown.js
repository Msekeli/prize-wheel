// countdown.js
document.addEventListener("DOMContentLoaded", function () {
  const countdownDiv = document.getElementById("countdown");
  const spinBtn = document.getElementById("spin-btn");

  // Function to update the countdown display
  const updateCountdown = (seconds) => {
    if (seconds > 0) {
      countdownDiv.innerHTML = `<p>Next valid spin in ${seconds} seconds</p>`;
    } else {
      countdownDiv.innerHTML = `<p>You may spin the wheel!</p>`;
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
