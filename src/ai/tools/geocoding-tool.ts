
'use server';
/**
 * @fileOverview A tool for converting GPS coordinates to a physical address.
 * 
 * - getAddressFromCoordinates - A function that returns a mock address for given coordinates.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeocodingInputSchema = z.object({
    latitude: z.number().describe('The latitude for the geocoding request.'),
    longitude: z.number().describe('The longitude for the geocoding request.'),
});
export type GeocodingInput = z.infer<typeof GeocodingInputSchema>;

const GeocodingOutputSchema = z.object({
    address: z.string().describe('The formatted address.'),
    pinCode: z.string().describe('The postal or pin code.'),
    city: z.string().describe('The city.'),
    country: z.string().describe('The country.'),
});
export type GeocodingOutput = z.infer<typeof GeocodingOutputSchema>;

const geocodingTool = ai.defineTool(
  {
    name: 'geocodingTool',
    description: 'Returns address information for a given latitude and longitude.',
    inputSchema: GeocodingInputSchema,
    outputSchema: GeocodingOutputSchema,
  },
  async (input) => {
    console.log(`Fetching address for lat: ${input.latitude}, lon: ${input.longitude}`);
    
    // In a real application, you would call a geocoding API here.
    // For now, we'll return mock data.
    const pinCodes = ["90210", "10001", "60606", "75001"];
    const randomPinCode = pinCodes[Math.floor(Math.random() * pinCodes.length)];
    
    return {
      address: '123 Mock Street, Fakeville',
      pinCode: randomPinCode,
      city: 'Faketown',
      country: 'Mockland'
    };
  }
);

export async function getAddressFromCoordinates(input: GeocodingInput): Promise<GeocodingOutput> {
    return await geocodingTool(input);
}
