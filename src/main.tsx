// Suppress benign browser ResizeObserver notifications and throttle callbacks
if (typeof window !== 'undefined') {
  const isResizeObserverError = (msg?: string | null) =>
    typeof msg === 'string' &&
    (msg.includes('ResizeObserver loop completed with undelivered notifications') ||
      msg.includes('ResizeObserver loop limit exceeded'));

  window.addEventListener('error', (event) => {
    if (isResizeObserverError(event.message)) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    if (isResizeObserverError(event.reason?.message)) {
      event.preventDefault();
    }
  });

  const NativeResizeObserver = window.ResizeObserver;
  if (NativeResizeObserver) {
    window.ResizeObserver = class extends NativeResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        super((entries, observer) => {
          window.requestAnimationFrame(() => {
            try {
              callback(entries, observer);
            } catch (err: any) {
              if (!isResizeObserverError(err?.message)) {
                throw err;
              }
            }
          });
        });
      }
    };
  }
}

import './bundle.css';
import './bundle.js';
