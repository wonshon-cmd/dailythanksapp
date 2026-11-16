import http from 'node:http';
import { loadConfig } from './config.js';
import { createStore } from './store.js';
import { createApp } from './app.js';

const config = loadConfig();
const store = createStore(config.dataFile);
const server = http.createServer(createApp({ config, store }));

server.listen(config.port, () => {
  const on = Object.entries(config.features).filter(([, v]) => v).map(([k]) => k);
  console.log(`Daily Thanks full-stack sample on http://localhost:${config.port}`);
  console.log(`Hidden features enabled: ${on.length ? on.join(', ') : 'none (FEATURE_PASSAGE / FEATURE_SERMON are off)'}`);
});
