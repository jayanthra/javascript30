let countdownTimer;

const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function countDown(seconds) {
  clearInterval(countdownTimer);
  let currentTime = Date.now()
  let endTime = currentTime + seconds * 1000

  displayTimeLeft(seconds)
  displayEndTime(endTime);

  countdownTimer = setInterval(() => {
    const timeRemaining = Math.round((endTime - Date.now()) / 1000)
    console.log(timeRemaining)
    if (timeRemaining < 0) {
      clearInterval(countdownTimer)
      return;
    }
    displayTimeLeft(timeRemaining)
  }, 1000)
}


function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;

  const hours = Math.floor(seconds / 3600);
  const remainderMinutes = String(minutes % 60).padStart(2, '0');

  const display = `${hours}:${remainderMinutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  endTime.textContent = `Ends at ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  countDown(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const mins = this.minutes.value;
  console.log(mins);
  countDown(mins * 60);
  this.reset();
});