import { useEffect, useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;;

function App() {
  const [city, setCity] = useState("Kolkata");
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName) => {
  if (!cityName.trim()) {
    setError("Please enter a city name.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to fetch weather data.");
    }

    setWeather(data);
    setCity(data.name);
  } catch (err) {
    setWeather(null);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchWeather("Kolkata");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(search);
    setSearch("");
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="app">
      <div className="weather-container">
        <div className="header">
          <h1>Weather Dashboard</h1>
          <p>Live weather information by city</p>
        </div>

        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading weather...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error">
            <span>⚠</span>
            {error}
          </div>
        )}

        {weather && !loading && !error && (
          <div className="weather-card">
            <div className="location">
              <h2>{weather.name}</h2>
              <p>{weather.sys.country}</p>
            </div>

            <div className="main-weather">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />

              <div>
                <div className="temperature">
                  {Math.round(weather.main.temp)}°C
                </div>
                <p className="condition">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>

            <div className="weather-details">
              <div className="detail">
                <span className="icon">💧</span>
                <div>
                  <p>Humidity</p>
                  <h3>{weather.main.humidity}%</h3>
                </div>
              </div>

              <div className="detail">
                <span className="icon">💨</span>
                <div>
                  <p>Wind Speed</p>
                  <h3>{weather.wind.speed} m/s</h3>
                </div>
              </div>

              <div className="detail">
                <span className="icon">🌅</span>
                <div>
                  <p>Sunrise</p>
                  <h3>{formatTime(weather.sys.sunrise)}</h3>
                </div>
              </div>

              <div className="detail">
                <span className="icon">🌇</span>
                <div>
                  <p>Sunset</p>
                  <h3>{formatTime(weather.sys.sunset)}</h3>
                </div>
              </div>
            </div>

            <div className="extra-info">
              <div>
                <span>Feels Like</span>
                <strong>{Math.round(weather.main.feels_like)}°C</strong>
              </div>

              <div>
                <span>Pressure</span>
                <strong>{weather.main.pressure} hPa</strong>
              </div>

              <div>
                <span>Min / Max</span>
                <strong>
                  {Math.round(weather.main.temp_min)}° /{" "}
                  {Math.round(weather.main.temp_max)}°
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;