// src/ai/flows/generate-action-plans-from-rockfall-prediction.ts
'use server';
/**
 * @fileOverview Generates action plans based on rockfall predictions.
 *
 * - generateActionPlans - A function that generates action plans based on the rockfall prediction.
 * - GenerateActionPlansInput - The input type for the generateActionPlans function.
 * - GenerateActionPlansOutput - The return type for the generateActionPlans function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateActionPlansInputSchema = z.object({
  rockfallProbability: z.number().describe('The probability of a rockfall event (0-1).'),
  rockfallScale: z.string().describe('The estimated scale/volume of the potential rockfall (e.g., small, medium, large).'),
  location: z.string().describe('The location of the potential rockfall event within the mine.'),
  sensorData: z.string().describe('Summary of recent sensor data readings (displacement, strain, pore pressure).'),
  environmentalFactors: z.string().describe('Summary of environmental factors (rainfall, temperature, vibrations).'),
});
export type GenerateActionPlansInput = z.infer<typeof GenerateActionPlansInputSchema>;

const GenerateActionPlansOutputSchema = z.object({
  actionPlans: z.array(z.string()).describe('A list of suggested action plans to mitigate the rockfall risk.'),
  riskLevel: z.string().describe('An assessment of the overall risk level (e.g., low, medium, high).'),
  justification: z.string().describe('A justification of the action plans based on the input data.')
});
export type GenerateActionPlansOutput = z.infer<typeof GenerateActionPlansOutputSchema>;

export async function generateActionPlans(input: GenerateActionPlansInput): Promise<GenerateActionPlansOutput> {
  return generateActionPlansFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateActionPlansPrompt',
  input: {schema: GenerateActionPlansInputSchema},
  output: {schema: GenerateActionPlansOutputSchema},
  prompt: `You are a highly experienced mine safety manager. You are responsible for generating action plans to mitigate rockfall risks in open-pit mines.

  Based on the following information, generate a list of action plans, assess the overall risk level, and provide a justification for the proposed action plans.

  Rockfall Probability: {{{rockfallProbability}}}
  Rockfall Scale: {{{rockfallScale}}}
  Location: {{{location}}}
  Sensor Data: {{{sensorData}}}
  Environmental Factors: {{{environmentalFactors}}}

  Provide the action plans as a numbered list. Be specific and practical in your recommendations. The action plans should address immediate safety concerns, monitoring requirements, and potential remediation strategies.  Explain clearly why each action plan is important.

  In your justification, explain how the rockfallProbability, rockfallScale, location, sensorData, and environmentalFactors influenced your recommendations.

  Format your answer as a JSON object with keys \"actionPlans\", \"riskLevel\", and \"justification\". The \"actionPlans\" should be a JSON array of strings. The \"riskLevel\" should be one of \"low\", \"medium\", or \"high\". The \"justification\" should be a short paragraph.
  `,
});

const generateActionPlansFlow = ai.defineFlow(
  {
    name: 'generateActionPlansFlow',
    inputSchema: GenerateActionPlansInputSchema,
    outputSchema: GenerateActionPlansOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
