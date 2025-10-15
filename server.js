import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();
