
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
    
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error("Google Maps API key not found.");
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${input.latitude},${input.longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Geocoding API error: ${data.status} - ${data.error_message || ''}`);
      }

      const result = data.results[0];
      if (!result) {
        throw new Error('No results found for the given coordinates.');
      }

      const address = result.formatted_address || 'Address not found';
      
      let pinCode = '';
      let city = '';
      let country = '';

      for (const component of result.address_components) {
        if (component.types.includes('postal_code')) {
          pinCode = component.long_name;
        }
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('country')) {
          country = component.long_name;
        }
      }

      return {
        address,
        pinCode: pinCode || 'N/A',
        city: city || 'N/A',
        country: country || 'N/A'
      };

    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      // Fallback to mock data in case of an API error
      return {
        address: '123 Mock Street, Fakeville',
        pinCode: '99999',
        city: 'Faketown',
        country: 'Mockland'
      };
    }
  }
);

export async function getAddressFromCoordinates(input: GeocodingInput): Promise<GeocodingOutput> {
    return await geocodingTool(input);
}
