const importMaps = {};
const importMapListeners = {};

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

const importMapPrefix = `importmap/`;

self.addEventListener("fetch", evt => {
  if (
    evt.request.url.startsWith("https://" + importMapPrefix) ||
    evt.request.url.startsWith("http://" + importMapPrefix)
  ) {
    evt.respondWith(resolveToUrl(evt));
  }
});

self.addEventListener("message", async function(messageEvent) {
  importMaps[messageEvent.source.id] = JSON.parse(messageEvent.data);
  if (importMapListeners[messageEvent.source.id]) {
    importMapListeners[messageEvent.source.id].forEach(l => l());
    importMapListeners[messageEvent.source.id] = null;
  }
  const client = await self.clients.get(messageEvent.source.id);
  client.postMessage("received import map");
});

function resolveToUrl(evt) {
  const importMapPromise = importMaps[evt.clientId]
    ? Promise.resolve()
    : new Promise(resolve => {
        importMapListeners[evt.clientId] =
          importMapListeners[evt.clientId] || [];
        importMapListeners[evt.clientId].push(resolve);
      });

  return importMapPromise.then(() => {
    const importMap = importMaps[evt.clientId];

    const resolvedUrl = synchronousResolve(importMap, evt);
    return fetch(resolvedUrl);
  });
}

function synchronousResolve(importMap, evt) {
  const specifier = evt.request.url.slice(
    evt.request.url.indexOf(importMapPrefix) + importMapPrefix.length
  );

  // To-do: actually implement import map resolution
  return specifier && importMap.imports[specifier];
}
