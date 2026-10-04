export function register() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';
      navigator.serviceWorker.register(swUrl)
        .then((registration) => {
          console.log('🛡️ RAKSHAK PWA Service Worker registered successfully:', registration.scope);
        })
        .catch((error) => {
          console.error('⚠️ Service Worker registration failed:', error);
        });
    });
  } else if ('serviceWorker' in navigator) {
    // Development mode registration
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('🛡️ RAKSHAK PWA Service Worker active (Dev Mode):', registration.scope);
        })
        .catch((error) => {
          console.warn('Service Worker Dev registration notice:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
