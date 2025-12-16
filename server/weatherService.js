const axios = require('axios');
const config = require('./config');
const { db } = require('./database');

class WeatherService {
  constructor() {
    this.apiKey = config.openweather.apiKey;
    this.baseUrl = config.openweather.baseUrl;
  }

  async getCurrentWeather(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const weatherData = {
        location: `${response.data.name}, ${response.data.sys.country}`,
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        windSpeed: response.data.wind.speed,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        timestamp: new Date().toISOString()
      };

      // Store in database
      this.storeWeatherData(weatherData);

      return {
        success: true,
        data: weatherData
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getWeatherForecast(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const forecast = response.data.list.slice(0, 8).map(item => ({
        datetime: item.dt_txt,
        temperature: item.main.temp,
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        windSpeed: item.wind.speed
      }));

      return {
        success: true,
        data: forecast
      };
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async geocode(query) {
    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct`;
      const response = await axios.get(url, {
        params: {
          q: query,
          limit: 5,
          appid: this.apiKey
        }
      });

      const results = response.data.map((item) => ({
        name: item.name,
        country: item.country,
        state: item.state || '',
        lat: item.lat,
        lon: item.lon
      }));

      return { success: true, data: results };
    } catch (error) {
      console.error('Error during geocoding:', error);
      return { success: false, error: error.message };
    }
  }

  storeWeatherData(weatherData) {
    const stmt = db.prepare(`
      INSERT INTO weather_data (location, temperature, humidity, pressure, wind_speed, description, icon)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      weatherData.location,
      weatherData.temperature,
      weatherData.humidity,
      weatherData.pressure,
      weatherData.windSpeed,
      weatherData.description,
      weatherData.icon
    );

    stmt.finalize();
  }

  async getHistoricalWeather(location, days = 7) {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM weather_data 
        WHERE location = ? 
        ORDER BY created_at DESC 
        LIMIT ?
      `, [location, days], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = WeatherService;
