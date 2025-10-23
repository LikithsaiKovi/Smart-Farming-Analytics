// Load environment variables
require('dotenv').config();

const config = {
  // Email Configuration
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'chottusai586@gmail.com',
      pass: 'alqlhwzvgbvavcsc'
    }
  },
  
  // OpenWeather API
  openweather: {
    apiKey: process.env.OPENWEATHER_API_KEY || '2170cf9f72b3eee31fdac25765223afd',
    baseUrl: 'https://api.openweathermap.org/data/2.5'
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: '24h'
  },
  
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development'
};

console.log('Config loaded:', config);
module.exports = config;
