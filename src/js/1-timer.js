// import flatpickr from 'flatpickr';
// import 'flatpickr/dist/flatpickr.min.css';
// import iziToast from 'izitoast';
// import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let timerInterval = null;
let selectedEndTime = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedEndTime = selectedDates[0];
    if (selectedEndTime <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

const updateTimer = () => {
  const now = new Date();
  const timeLeft = selectedEndTime - now;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeLeft);

  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
};

const startTimer = () => {
  timerInterval = setInterval(updateTimer, 1000);
};

startButton.addEventListener('click', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  updateTimer();
  startTimer();
  startButton.disabled = true;
  datetimePicker.disabled = true;
});

startButton.disabled = true;

const addLeadingZero = value => String(value).padStart(2, '0');

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
