const { requireEnv } = require('./config/env');
const connectDB = require('./config/db');

const start = async () => {
  requireEnv('MONGODB_URI', 'JWT_SECRET');

  const app = require('./app');
  await connectDB();
  console.log('MongoDB connected');

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start().catch(err => {
  console.error('Startup failed:', err.message);
  if (/querySrv/.test(err.message)) {
    console.error('Your DNS refused the MongoDB lookup. Set DNS_SERVERS in backend/.env (see .env.example).');
  }
  process.exit(1);
});
