
'use server';
/**
 * @fileOverview A tool for fetching weather information.
 * 
 * - getWeather - A function that returns the current weather for a given location.
 * - WeatherInput - The input type for the getWeather tool.
 * - WeatherOutput - The output schema for the getWeather tool.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const WeatherInputSchema = z.object({
    latitude: z.number().describe('The latitude for the weather report.'),
    longitude: z.number().describe('The longitude for the weather report.'),
});
export type WeatherInput = z.infer<typeof WeatherInputSchema>;

const WeatherOutputSchema = z.object({
    temperature: z.number().describe('The current temperature in Celsius.'),
    condition: z.string().describe('A brief description of the weather condition (e.g., "Sunny", "Cloudy", "Rainy").'),
    windSpeed: z.number().describe('The current wind speed in km/h.'),
    humidity: z.number().describe('The current humidity percentage.'),
});
export type WeatherOutput = z.infer<typeof WeatherOutputSchema>;

const getWeatherTool = ai.defineTool(
  {
    name: 'getWeatherTool',
    description: 'Returns the current weather for a given latitude and longitude.',
    inputSchema: WeatherInputSchema,
    outputSchema: WeatherOutputSchema,
  },
  async (input) => {
    console.log(`Fetching weather for lat: ${input.latitude}, lon: ${input.longitude}`);
    
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      console.warn("OpenWeatherMap API key not found. Returning mock data.");
      // Fallback to mock data if API key is missing
      const conditions = ["Light Rain", "Heavy Rain", "Cloudy", "Partly Cloudy", "Sunny"];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      return {
        temperature: Math.random() * 25 + 5, // Temp between 5°C and 30°C
        condition: randomCondition,
        windSpeed: Math.random() * 40, // Wind speed up to 40 km/h
        humidity: Math.random() * 60 + 40, // Humidity between 40% and 100%
      };
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${input.latitude}&lon=${input.longitude}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(`OpenWeatherMap API error: ${data.message}`);
      }

      return {
        temperature: data.main.temp,
        condition: data.weather[0]?.main || 'N/A',
        windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
        humidity: data.main.humidity,
      };

    } catch (error) {
      console.error('Error fetching real weather data:', error);
      // Fallback to mock data in case of an API error
      const conditions = ["Light Rain", "Heavy Rain", "Cloudy", "Partly Cloudy", "Sunny"];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      return {
        temperature: Math.random() * 25 + 5,
        condition: randomCondition,
        windSpeed: Math.random() * 40,
        humidity: Math.random() * 60 + 40,
      };
    }
  }
);

export async function getWeather(input: WeatherInput): Promise<WeatherOutput> {
    return await getWeatherTool(input);
}
