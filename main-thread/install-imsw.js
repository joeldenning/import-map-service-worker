let ready;

export const importMapsReady = new Promise(resolve => {
  ready = resolve;
});

if ("serviceWorker" in navigator) {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.addEventListener("message", ready);
    sendImportMap(navigator.serviceWorker.controller);
  } else {
    navigator.serviceWorker
      .register("/service-worker/interceptor-imsw.js", { scope: "/" })
      .then(registration => {
        // Good for debugging
        // window.addEventListener('unload', () => {
        //   registration.unregister()
        // })

        if (registration.installing) {
          registration.installing.onstatechange = function() {
            if (
              registration.active &&
              registration.active.state === "activated"
            ) {
              navigator.serviceWorker.addEventListener("message", ready);
              sendImportMap(registration.active);
            }
          };
        }
      });
  }
} else {
  throw Error(
    "import-map-service-worker does not work in this browser because it does not support service workers"
  );
}

function sendImportMap(sw) {
  const messageChannel = new MessageChannel();
  const importmap = document.querySelector("script[type=importmap]");
  sw.postMessage(importmap.textContent, [messageChannel.port2]);
}
