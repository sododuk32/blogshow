// Must be in ESM form!
console.log('[Worker] Loaded');

const ports = [];

self.addEventListener('connect', (event) => {
  console.log('[Worker] connect');

  const port = event.ports[0];
  ports.push(port);

  port.onmessage = (e) => {
    console.log('[Worker] got message:');
    console.log(e.data)
    port.postMessage('[echo] ' )
    port.postMessage(e.data);
  };

  port.start();
});

export {}; // ✅ absolutely required for ESM parsing
