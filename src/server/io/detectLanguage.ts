import { DEFAULT_LANGUAGE } from '../../language';
import { countries } from './enums';

export async function detectLanguage(ip: string, fallbackLanguage = DEFAULT_LANGUAGE) {
  try {
    const response = await fetch(`https://api.country.is/${ip}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) throw new Error('Country lookup failed');
    const { country } = await response.json();
    const detectedLanguage = countries[country]?.language;
    return {
      country: country || 'N/A',
      language: ['cs', 'pl', 'en'].includes(detectedLanguage)
        ? detectedLanguage
        : DEFAULT_LANGUAGE,
    };
  } catch {
    return { country: 'N/A', language: fallbackLanguage };
  }
}
