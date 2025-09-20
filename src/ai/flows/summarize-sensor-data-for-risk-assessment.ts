// SummarizeSensorDataForRiskAssessment flow
'use server';

/**
 * @fileOverview Summarizes geotechnical sensor data and environmental factors to identify potential rockfall precursors.
 *
 * - summarizeSensorDataForRiskAssessment - A function that summarizes sensor data for risk assessment.
 * - SummarizeSensorDataForRiskAssessmentInput - The input type for the summarizeSensorDataForRiskAssessment function.
 * - SummarizeSensorDataForRiskAssessmentOutput - The return type for the summarizeSensorDataForRiskAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SummarizeSensorDataForRiskAssessmentInputSchema = z.object({
  sensorData: z.string().describe('Geotechnical sensor data (displacement, strain, pore pressure).'),
  environmentalFactors: z.string().describe('Environmental factors (rainfall, temperature, vibrations).'),
});

export type SummarizeSensorDataForRiskAssessmentInput = z.infer<typeof SummarizeSensorDataForRiskAssessmentInputSchema>;

const SummarizeSensorDataForRiskAssessmentOutputSchema = z.object({
  summary: z.string().describe('A summary of the sensor data and environmental factors, highlighting potential rockfall precursors.'),
  riskLevel: z.string().describe('An overall risk level assessment (e.g., low, medium, high) based on the data.'),
  criticalAreas: z.string().describe('Specific areas identified as being at high risk of rockfall.'),
});

export type SummarizeSensorDataForRiskAssessmentOutput = z.infer<typeof SummarizeSensorDataForRiskAssessmentOutputSchema>;

export async function summarizeSensorDataForRiskAssessment(
  input: SummarizeSensorDataForRiskAssessmentInput
): Promise<SummarizeSensorDataForRiskAssessmentOutput> {
  return summarizeSensorDataForRiskAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSensorDataForRiskAssessmentPrompt',
  input: {
    schema: SummarizeSensorDataForRiskAssessmentInputSchema,
  },
  output: {
    schema: SummarizeSensorDataForRiskAssessmentOutputSchema,
  },
  prompt: `You are a mining safety expert. Summarize the following geotechnical sensor data and environmental factors to identify potential rockfall precursors. Provide an overall risk level assessment (low, medium, high) and identify critical areas at high risk of rockfall.

Sensor Data: {{{sensorData}}}
Environmental Factors: {{{environmentalFactors}}}

Summary:
Risk Level:
Critical Areas:`,
});

const summarizeSensorDataForRiskAssessmentFlow = ai.defineFlow(
  {
    name: 'summarizeSensorDataForRiskAssessmentFlow',
    inputSchema: SummarizeSensorDataForRiskAssessmentInputSchema,
    outputSchema: SummarizeSensorDataForRiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
