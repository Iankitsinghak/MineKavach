
'use server';
/**
 * @fileOverview A tool for finding nearby mines using the Google Places API.
 * 
 * - getNearbyMines - A function that returns a list of nearby mines.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const NearbyMinesInputSchema = z.object({
    latitude: z.number().describe('The latitude to search from.'),
    longitude: z.number().describe('The longitude to search from.'),
});
export type NearbyMinesInput = z.infer<typeof NearbyMinesInputSchema>;

const MineSchema = z.object({
    id: z.string().describe("The place ID of the mine."),
    name: z.string().describe("The name of the mine.")
});

const NearbyMinesOutputSchema = z.object({
    mines: z.array(MineSchema).describe('A list of nearby mines.'),
});
export type NearbyMinesOutput = z.infer<typeof NearbyMinesOutputSchema>;

const getNearbyMinesTool = ai.defineTool(
  {
    name: 'getNearbyMinesTool',
    description: 'Returns a list of nearby mines for a given latitude and longitude.',
    inputSchema: NearbyMinesInputSchema,
    outputSchema: NearbyMinesOutputSchema,
  },
  async (input) => {
    console.log(`Fetching nearby mines for lat: ${input.latitude}, lon: ${input.longitude}`);
    
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error("Google Maps API key not found.");
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${input.latitude},${input.longitude}&radius=50000&type=mine&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Places API error: ${data.status} - ${data.error_message || ''}`);
      }

      const mines = (data.results || []).map((result: any) => ({
        id: result.place_id,
        name: result.name,
      }));

      return { mines };

    } catch (error) {
      console.error('Error fetching nearby mines data:', error);
      // Fallback to mock data in case of an API error
       return {
        mines: [
            { id: 'north-star', name: 'North Star Quarry (Mock)' },
            { id: 'eagle-peak', name: 'Eagle Peak Mine (Mock)' },
            { id: 'crystal-mountain', name: 'Crystal Mountain (Mock)'},
        ]
      };
    }
  }
);

export async function getNearbyMines(input: NearbyMinesInput): Promise<NearbyMinesOutput> {
    return await getNearbyMinesTool(input);
}
