
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-sensor-data-for-risk-assessment.ts';
import '@/ai/flows/generate-action-plans-from-rockfall-prediction.ts';
import '@/ai/flows/analyze-current-risk-from-sensors.ts';
import '@/ai/tools/weather-tool.ts';
import '@/ai/tools/geocoding-tool.ts';
import '@/ai/tools/nearby-mines-tool.ts';
