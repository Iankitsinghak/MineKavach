// src/ai/flows/analyze-current-risk-from-sensors.ts
'use server';
/**
 * @fileOverview Analyzes sensor data to generate a list of current risks.
 *
 * - analyzeCurrentRiskFromSensors - A function that analyzes sensor data to identify risks.
 * - AnalyzeCurrentRiskFromSensorsInput - The input type for the function.
 * - AnalyzeCurrentRiskFromSensorsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AnalyzeCurrentRiskFromSensorsInputSchema = z.object({
  sensorData: z.string().describe('A JSON string of recent geotechnical sensor data readings (e.g., displacement, strain, pore pressure).'),
  environmentalFactors: z.string().describe('A summary of current environmental factors (e.g., rainfall, temperature, recent vibrations).'),
});
export type AnalyzeCurrentRiskFromSensorsInput = z.infer<typeof AnalyzeCurrentRiskFromSensorsInputSchema>;

const AnalyzedRiskSchema = z.object({
    severity: z.enum(['Low', 'Medium', 'High']).describe('The assessed severity of the risk.'),
    location: z.string().describe('The specific location within the mine where the risk is identified.'),
    description: z.string().describe('A detailed description of the risk, its potential consequences, and the data that indicates this risk.'),
});
export type AnalyzedRisk = z.infer<typeof AnalyzedRiskSchema>;


const AnalyzeCurrentRiskFromSensorsOutputSchema = z.object({
  risks: z.array(AnalyzedRiskSchema).describe('A list of identified risks.'),
});
export type AnalyzeCurrentRiskFromSensorsOutput = z.infer<typeof AnalyzeCurrentRiskFromSensorsOutputSchema>;

export async function analyzeCurrentRiskFromSensors(input: AnalyzeCurrentRiskFromSensorsInput): Promise<AnalyzeCurrentRiskFromSensorsOutput> {
  return analyzeCurrentRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCurrentRiskPrompt',
  input: {schema: AnalyzeCurrentRiskFromSensorsInputSchema},
  output: {schema: AnalyzeCurrentRiskFromSensorsOutputSchema},
  prompt: `You are a geotechnical engineering expert specializing in open-pit mine safety and risk assessment. Your task is to analyze sensor data and environmental factors to identify potential rockfall risks.

  Analyze the provided data and generate a list of risks. For each risk, you must provide:
  1.  A severity level ('Low', 'Medium', 'High').
  2.  The specific location of the risk (e.g., "Bench 3, West Wall").
  3.  A detailed description of the risk. This description should explain what the risk is, what the potential consequences are (e.g., "could lead to a small-scale rockfall affecting haul road access"), and which specific data points (from both sensor data and environmental factors) led you to this conclusion.

  Be thorough in your analysis. Correlate trends in sensor data with environmental conditions. For example, does an increase in pore pressure correspond with recent rainfall?

  If there are no significant risks identified, return an empty array for the "risks" field.

  Sensor Data:
  {{{sensorData}}}

  Environmental Factors:
  {{{environmentalFactors}}}
  `,
});

const analyzeCurrentRiskFlow = ai.defineFlow(
  {
    name: 'analyzeCurrentRiskFlow',
    inputSchema: AnalyzeCurrentRiskFromSensorsInputSchema,
    outputSchema: AnalyzeCurrentRiskFromSensorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
