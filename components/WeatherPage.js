import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

// OpenWeatherMap API key and city name
const API_KEY = "###";
const CITY_NAME = "Singapore";

// WeatherPage functional component
const WeatherPage = () => {
  // State variables for storing weather data and expanded day
  const [weatherData, setWeatherData] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  // Fetch weather data on component mount
  useEffect(() => {
    fetchWeatherData();
  }, []);

  // Function to fetch weather data from the OpenWeatherMap API
  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?q=${CITY_NAME}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Weather Data:", data);

      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
    }
  };

  // Function to render the weather forecast based on the fetched data
  const renderWeatherForecast = () => {
    if (!weatherData) {
      return null;
    }

    const forecastsByDay = {};

    // Organize forecast data by day
    weatherData.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!forecastsByDay[date]) {
        forecastsByDay[date] = [];
      }
      forecastsByDay[date].push({
        datetime: item.dt_txt,
        temperature: item.main.temp,
        icon: item.weather[0].icon,
      });
    });

    return (
      <View style={styles.chartContainer}>
        {Object.keys(forecastsByDay).map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() =>
              setExpandedDay((prev) => (prev === day ? null : day))
            }
            style={[
              styles.forecastItem,
              expandedDay === day && styles.expandedItem,
            ]}
          >
            <Text style={styles.dayText}>{getDayOfWeek(day)}</Text>
            {expandedDay === day &&
              forecastsByDay[day].map((forecast) => (
                <View key={forecast.datetime}>
                  <Image
                    style={styles.weatherIcon}
                    source={{
                      uri: `http://openweathermap.org/img/w/${forecast.icon}.png`,
                    }}
                  />
                  <Text style={styles.forecastText}>
                    {Math.round(forecast.temperature - 273.15)}°C -{" "}
                    {getTime(forecast.datetime)}
                  </Text>
                </View>
              ))}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Function to get the day of the week from a date string
  const getDayOfWeek = (date) => {
    const options = { weekday: "long" };
    const day = new Date(date);
    const today = new Date();

    if (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    ) {
      return `${day.toLocaleDateString(undefined, options)} (Today)`;
    }

    return day.toLocaleDateString(undefined, options);
  };

  // Function to get the time from a datetime string
  const getTime = (datetime) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(datetime).toLocaleTimeString(undefined, options);
  };

  // Return the JSX for the WeatherPage component
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Singapore Weather</Text>
      {renderWeatherForecast()}
    </ScrollView>
  );
};

// Styles for the WeatherPage component
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F2F5F9",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#333",
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    width: "100%",
    alignSelf: "center",
    padding: 16,
  },
  forecastItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  expandedItem: {
    backgroundColor: "#EFEFEF",
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  forecastText: {
    fontSize: 16,
    color: "#333",
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
});

export default WeatherPage;
