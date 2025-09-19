const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// SSL configuration
const sslOptions = {
  key: fs.readFileSync('./ssl/privatekey.pem'),
  cert: fs.readFileSync('./ssl/certificate.pem'),
};

// Connect to MongoDB and start HTTPS server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`✅ Secure server running at https://localhost:${PORT}`);
      console.log(`🛡️ CSP mode: ${process.env.NODE_ENV !== "production" ? "REPORT-ONLY (dev)" : "ENFORCED (prod)"}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection errorr:', err);
  });
