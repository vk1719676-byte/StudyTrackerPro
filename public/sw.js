// Service Worker for background notifications and PWA support
const CACHE_NAME = 'focus-timer-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached resources when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Background sync for notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-timer') {
    event.waitUntil(handleBackgroundTimer());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Focus timer update',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Open Timer',
        icon: '/icon-72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Focus Timer', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_NOTIFICATIONS') {
    self.registration.getNotifications().then((notifications) => {
      notifications.forEach((notification) => {
        if (!event.data.tag || notification.tag === event.data.tag) {
          notification.close();
        }
      });
    });
  }
});

// Background timer handling
async function handleBackgroundTimer() {
  try {
    // This would sync with the timer state and send notifications
    const clients = await self.clients.matchAll();
    
    if (clients.length === 0) {
      // No active clients, handle background timer logic
      const timerState = await getTimerState();
      
      if (timerState && timerState.isRunning) {
        const now = Date.now();
        const elapsed = timerState.lastUpdated 
          ? Math.floor((now - timerState.lastUpdated) / 1000) 
          : 0;
        
        const newTime = Math.min(
          timerState.time + elapsed, 
          timerState.targetTime * 60
        );
        
        // Check if session should complete
        if (newTime >= timerState.targetTime * 60) {
          await showSessionCompleteNotification(timerState);
        }
        
        // Update timer state
        await updateTimerState({
          ...timerState,
          time: newTime,
          lastUpdated: now
        });
      }
    }
  } catch (error) {
    console.error('Background timer error:', error);
  }
}

async function getTimerState() {
  // This would integrate with IndexedDB or other storage
  // For now, we'll use a simple approach
  return null;
}

async function updateTimerState(state) {
  // Update the timer state in storage
  console.log('Updating timer state:', state);
}

async function showSessionCompleteNotification(timerState) {
  const title = timerState.mode === 'focus' 
    ? '🎉 Focus Session Complete!' 
    : '⏰ Break Time Over!';
  
  const body = timerState.mode === 'focus'
    ? 'Great work! Time for a break.'
    : 'Break time is over. Ready to focus again?';

  await self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    requireInteraction: true,
    vibrate: [300, 200, 300, 200, 300],
    actions: [
      {
        action: 'continue',
        title: 'Continue',
        icon: '/icon-72.png'
      },
      {
        action: 'stop',
        title: 'Stop Timer',
        icon: '/icon-72.png'
      }
    ]
  });
}
