// Izaan Shop - cPanel Absolute Monolith Entry Point
// This handles BOTH the Express.js Backend API and the Next.js Frontend UI!

require('dotenv').config();
const next = require('next');
const backendApp = require('./backend/server.js'); // Your Express App

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 5001;

// 1. Initialize Next.js, explicitly pointing its Engine to the next-frontend folder
const nextApp = next({ dev, hostname, port, dir: './next-frontend' });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  console.log('✅ Next.js Frontend Engine is Ready!');

  // 2. Catch-All Route (Monolithic Router)
  // Express handles specific `/api/*` routes natively inside backend/server.js
  // Any route that isn't an API (like `/`, `/cart`, `/admin`) is sent directly to Next.js to render HTML!
  backendApp.use((req, res) => {
    return handle(req, res);
  });

  // 3. Start Listening (Passenger hooks into this listen event)
  backendApp.listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 Master Monolith running securely on port ${port}`);
  });

}).catch((err) => {
  console.error("❌ Next.js preparation failed:", err);
  process.exit(1);
});
