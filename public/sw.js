// Service Worker for background timer functionality
let timerInterval = null;
let timerState = {
  isRunning: false,
  startTime: null,
  elapsed: 0,
  subject: '',
  topic: '',
  lastNotification: 0
};

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'START_BACKGROUND_TIMER':
      startBackgroundTimer(data);
      break;
    case 'STOP_BACKGROUND_TIMER':
      stopBackgroundTimer();
      break;
    case 'GET_TIMER_STATE':
      event.ports[0].postMessage({ type: 'TIMER_STATE', data: getTimerState() });
      break;
  }
});

function startBackgroundTimer(data) {
  timerState = {
    isRunning: true,
    startTime: Date.now(),
    elapsed: data.elapsed || 0,
    subject: data.subject,
    topic: data.topic,
    lastNotification: Date.now()
  };

  // Clear any existing interva
