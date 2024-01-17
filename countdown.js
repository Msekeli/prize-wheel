// countdown.js
document.addEventListener("DOMContentLoaded", function () {
    const countdownDiv = document.getElementById("countdown");
  
    // Function to update the countdown display
    const updateCountdown = (seconds) => {
      countdownDiv.innerHTML = `<p>Next valid spin in ${seconds} seconds</p>`;
    };
  
    // Function to start the countdown
    const startCountdown = (remainingSeconds) => {
      let countdownInterval = setInterval(() => {
        updateCountdown(remainingSeconds);
  
        if (remainingSeconds <= 0) {
          clearInterval(countdownInterval);
          countdownDiv.innerHTML = '';
          spinBtn.disabled = false;
        }
  
        remainingSeconds--;
      }, 1000);
    };
  
    // Function to calculate the remaining seconds until the next valid spin
    const calculateRemainingSeconds = (currentMinute) => {
      const secondsInMinute = 60;
      const secondsUntilNextSpin = currentMinute % 2 === 0 ? 0 : secondsInMinute - 1;
      return secondsUntilNextSpin;
    };
  
    // Fetch the current time and calculate remaining seconds until the next valid spin
    const currentTime = new Date();
    const currentMinute = currentTime.getMinutes();
    const remainingSeconds = calculateRemainingSeconds(currentMinute);
  
    // Update the countdown and start it
    updateCountdown(remainingSeconds);
    startCountdown(remainingSeconds);
  });
  