// Types for our weather data
export interface HourlyForecast {
  time: string
  temp: number
  condition: string
}

export interface WeatherData {
  date: Date
  temperature: number
  feelsLike: number
  high: number
  low: number
  condition: string
  wind: number
  precipitation: number
  sunrise: string
  sunset: string
  hourly: HourlyForecast[]
}

// Weather conditions to randomly select from
const weatherConditions = ["Sunny", "Cloudy", "Rainy", "Drizzle", "Snowy", "Stormy"]

// Function to generate a random number between min and max
const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Function to generate random hourly forecast data
const generateHourlyForecast = (baseTemp: number, condition: string): HourlyForecast[] => {
  const hours = []

  // Generate data for 8 hours
  for (let i = 0; i < 8; i++) {
    const hourNum = 7 + i // Start from 7am
    const time = `${hourNum > 12 ? hourNum - 12 : hourNum}${hourNum >= 12 ? "pm" : "am"}`

    // Temperature varies slightly from the base temperature
    const tempVariation = randomBetween(-3, 3)
    const temp = baseTemp + tempVariation

    // Mostly keep the same condition, but occasionally change
    const useBaseCondition = Math.random() > 0.3
    const hourCondition = useBaseCondition
      ? condition
      : weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

    hours.push({
      time,
      temp,
      condition: hourCondition,
    })
  }

  return hours
}

// Function to generate weather data for the specified number of days
export const generateWeatherData = (days: number): WeatherData[] => {
  const weatherData: WeatherData[] = []
  const today = new Date()

  for (let i = 0; i < days; i++) {
    // Create date for this day (today - i days)
    const date = new Date()
    date.setDate(today.getDate() - i)

    // Generate random temperature between 40 and 85
    const baseTemp = randomBetween(40, 85)

    // Random condition
    const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

    // Generate other weather attributes
    const high = baseTemp + randomBetween(1, 5)
    const low = baseTemp - randomBetween(5, 15)
    const feelsLike = baseTemp + randomBetween(-3, 3)
    const wind = randomBetween(0, 20)
    const precipitation = randomBetween(0, 100)

    // Generate sunrise and sunset times
    const sunriseHour = randomBetween(5, 7)
    const sunsetHour = randomBetween(5, 8)
    const sunrise = `${sunriseHour}:${randomBetween(0, 59).toString().padStart(2, "0")}am`
    const sunset = `${sunsetHour}:${randomBetween(0, 59).toString().padStart(2, "0")}pm`

    // Generate hourly forecast
    const hourly = generateHourlyForecast(baseTemp, condition)

    weatherData.push({
      date,
      temperature: baseTemp,
      feelsLike,
      high,
      low,
      condition,
      wind,
      precipitation,
      sunrise,
      sunset,
      hourly,
    })
  }

  return weatherData
}
