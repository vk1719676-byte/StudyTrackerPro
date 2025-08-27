// Service Worker for background alarm notifications
const CACHE_NAME = 'alarm-cache-v1';

self.addEventListener('install', (event) => {
  console.log('Alarm Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Alarm Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Background sync for alarms
self.addEventListener('sync', (event) => {
  if (event.tag === 'alarm-check') {
    event.waitUntil(checkAlarms());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Time for your study session!',
    icon: '/icons/alarm-icon.png',
    badge: '/icons/study-badge.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      {
        action: 'snooze',
        title: 'Snooze 5min',
        icon: '/icons/snooze-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Study Reminder', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'snooze') {
    // Handle snooze action
    scheduleSnooze();
  } else if (event.action === 'dismiss') {
    // Handle dismiss action
    console.log('Alarm dismissed');
  } else {
    // Open the app
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        if (clients.length > 0) {
          return clients[0].focus();
        }
        return self.clients.openWindow('/');
      })
    );
  }
});

// Check for due alarms
async function checkAlarms() {
  try {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];

    // Get alarms from storage (in a real app, this would be from IndexedDB or similar)
    const alarms = await getStoredAlarms();
    
    for (const alarm of alarms) {
      if (
        alarm.enabled &&
        alarm.time === currentTime &&
        alarm.days.includes(currentDay)
      ) {
        await triggerBackgroundAlarm(alarm);
      }
    }
  } catch (error) {
    console.error('Error checking alarms:', error);
  }
}

async function getStoredAlarms() {
  // In a real implementation, use IndexedDB
  return [];
}

async function triggerBackgroundAlarm(alarm) {
  const options = {
    body: alarm.customMessage || getDefaultMessage(alarm.type),
    icon: '/icons/alarm-icon.png',
    badge: '/icons/study-badge.png',
    tag: alarm.id,
    vibrate: alarm.vibrate ? [200, 100, 200, 100, 200] : undefined,
    requireInteraction: true,
    actions: alarm.snoozeEnabled ? [
      {
        action: 'snooze',
        title: `Snooze ${alarm.snoozeMinutes}min`,
        icon: '/icons/snooze-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.png'
      }
    ] : [
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.png'
      }
    ]
  };

  await self.registration.showNotification(alarm.name, options);
}

function getDefaultMessage(type) {
  switch (type) {
    case 'study': return 'Time to start your focused study session! 📚';
    case 'break': return 'Take a break! Your brain needs to recharge ☕';
    case 'exam': return 'Exam reminder! Review your preparation 🎯';
    case 'focus': return 'Enter deep focus mode for maximum productivity 🧠';
    case 'sleep': return 'Time to rest! Good sleep improves learning 🌙';
    default: return 'Study reminder notification';
  }
}

function scheduleSnooze() {
  // Schedule a snooze notification
  setTimeout(() => {
    self.registration.showNotification('Snoozed Alarm', {
      body: 'Your snoozed alarm is now active!',
      icon: '/icons/alarm-icon.png',
      badge: '/icons/study-badge.png',
      vibrate: [200, 100, 200],
      requireInteraction: true
    });
  }, 5 * 60 * 1000); // 5 minutes
}
