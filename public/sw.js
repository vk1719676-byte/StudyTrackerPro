// Service Worker for background alarm functionality
const CACHE_NAME = 'studybuddy-alarms-v1';
const urlsToCache = [
  '/',
  '/sounds/gentle-chime.mp3',
  '/sounds/focus-bell.mp3',
  '/sounds/study-reminder.mp3',
  '/sounds/urgent-alert.mp3',
  '/sounds/peaceful-wake.mp3'
];

// Install service worker and cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Background sync for alarms
self.addEventListener('sync', (event) => {
  if (event.tag === 'alarm-sync') {
    event.waitUntil(checkAlarms());
  }
});

// Handle background fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Push notifications for alarms
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: data.vibrate ? [200, 100, 200] : [],
      tag: data.tag || 'alarm',
      data: data,
      requireInteraction: data.priority === 'urgent',
      actions: data.snoozeEnabled ? [
        { action: 'snooze', title: 'Snooze' },
        { action: 'dismiss', title: 'Dismiss' }
      ] : [
        { action: 'dismiss', title: 'Dismiss' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'snooze') {
    // Handle snooze action
    const alarmId = event.notification.data?.alarmId;
    if (alarmId) {
      // Schedule snooze notification
      event.waitUntil(
        scheduleSnooze(alarmId)
      );
    }
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background alarm checking
async function checkAlarms() {
  try {
    const alarms = JSON.parse(localStorage.getItem('studyBuddy_alarms') || '[]');
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay();

    for (const alarm of alarms) {
      if (!alarm.enabled) continue;

      if (shouldTriggerAlarm(alarm, currentTime, currentDay, now)) {
        await triggerBackgroundAlarm(alarm);
      }
    }
  } catch (error) {
    console.error('Error checking alarms:', error);
  }
}

function shouldTriggerAlarm(alarm, currentTime, currentDay, now) {
  if (alarm.time !== currentTime) return false;

  // Check if already triggered within the last minute
  if (alarm.lastTriggered && (now.getTime() - new Date(alarm.lastTriggered).getTime()) < 60000) {
    return false;
  }

  // Check day of week
  if (alarm.days && alarm.days.length > 0) {
    return alarm.days.includes(currentDay);
  }

  return true;
}

async function triggerBackgroundAlarm(alarm) {
  const notificationData = {
    title: alarm.title,
    body: alarm.description || 'Alarm triggered',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: `alarm-${alarm.id}`,
    vibrate: alarm.vibrate,
    priority: alarm.priority,
    snoozeEnabled: alarm.snoozeEnabled,
    alarmId: alarm.id
  };

  // Show notification
  await self.registration.showNotification(alarm.title, notificationData);
  
  // Update alarm's last triggered time
  alarm.lastTriggered = new Date().toISOString();
  const alarms = JSON.parse(localStorage.getItem('studyBuddy_alarms') || '[]');
  const index = alarms.findIndex(a => a.id === alarm.id);
  if (index !== -1) {
    alarms[index] = alarm;
    localStorage.setItem('studyBuddy_alarms', JSON.stringify(alarms));
  }
}

async function scheduleSnooze(alarmId) {
  const alarms = JSON.parse(localStorage.getItem('studyBuddy_alarms') || '[]');
  const alarm = alarms.find(a => a.id === alarmId);
  
  if (!alarm || !alarm.snoozeEnabled) return;

  // Create snoozed notification
  const snoozeTime = new Date();
  snoozeTime.setMinutes(snoozeTime.getMinutes() + alarm.snoozeInterval);
  
  setTimeout(async () => {
    const snoozeNotification = {
      title: `⏰ ${alarm.title} (Snoozed)`,
      body: alarm.description || 'Snoozed alarm',
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      tag: `snooze-${alarm.id}`,
      vibrate: alarm.vibrate,
      priority: alarm.priority
    };

    await self.registration.showNotification(snoozeNotification.title, snoozeNotification);
  }, alarm.snoozeInterval * 60 * 1000);
}

// Periodic background sync
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Keep the service worker active
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
