import { getProtocols } from '../protocols/protocols.service';

export async function generateFollowUpQuestions(
  question: string,
  answer: string
): Promise<string[]> {
  // This is a simplified example - in practice you'd want to use
  // more sophisticated NLP to generate relevant follow-ups
  const commonFollowUps = [
    'What are the side effects of this treatment?',
    'Are there alternative treatments available?',
    'What monitoring is required during treatment?',
    'What supportive care measures are recommended?'
  ];

  // For demo purposes, return common follow-ups
  // In production, you'd want to generate these dynamically
  return commonFollowUps;
}
