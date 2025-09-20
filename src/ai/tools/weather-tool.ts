
'use server';
/**
 * @fileOverview A tool for fetching weather information.
 * 
 * - getWeather - A tool that returns the current weather for a given location.
 * - WeatherInput - The input schema for the getWeather tool.
 * - WeatherOutput - The output schema for the getWeather tool.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const WeatherInputSchema = z.object({
    latitude: z.number().describe('The latitude for the weather report.'),
    longitude: z.number().describe('The longitude for the weather report.'),
});
export type WeatherInput = z.infer<typeof WeatherInputSchema>;

export const WeatherOutputSchema = z.object({
    temperature: z.number().describe('The current temperature in Celsius.'),
    condition: z.string().describe('A brief description of the weather condition (e.g., "Sunny", "Cloudy", "Rainy").'),
    windSpeed: z.number().describe('The current wind speed in km/h.'),
    humidity: z.number().describe('The current humidity percentage.'),
});
export type WeatherOutput = z.infer<typeof WeatherOutputSchema>;

export const getWeather = ai.defineTool(
  {
    name: 'getWeather',
    description: 'Returns the current weather for a given latitude and longitude.',
    inputSchema: WeatherInputSchema,
    outputSchema: WeatherOutputSchema,
  },
  async (input) => {
    console.log(`Fetching weather for lat: ${input.latitude}, lon: ${input.longitude}`);
    
    // In a real application, you would call a weather API here.
    // For now, we'll return mock data.
    const conditions = ["Light Rain", "Heavy Rain", "Cloudy", "Partly Cloudy", "Sunny"];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      temperature: Math.random() * 25 + 5, // Temp between 5°C and 30°C
      condition: randomCondition,
      windSpeed: Math.random() * 40, // Wind speed up to 40 km/h
      humidity: Math.random() * 60 + 40, // Humidity between 40% and 100%
    };
  }
);
