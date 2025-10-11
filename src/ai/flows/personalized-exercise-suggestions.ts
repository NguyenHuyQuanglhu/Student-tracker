'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized exercise suggestions to students.
 *
 * The flow takes into account a student's learning progress, scores, and areas of improvement to suggest relevant exercises.
 *
 * - personalizedExerciseSuggestions - A function that orchestrates the flow and returns exercise suggestions.
 * - PersonalizedExerciseSuggestionsInput - The input type for the personalizedExerciseSuggestions function.
 * - PersonalizedExerciseSuggestionsOutput - The output type for the personalizedExerciseSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the personalized exercise suggestions flow.
const PersonalizedExerciseSuggestionsInputSchema = z.object({
  studentId: z.string().describe('The unique identifier of the student.'),
  courseId: z.string().describe('The unique identifier of the course.'),
  learningProgress: z
    .string()
    .describe(
      'A description of the student learning progress, including completed topics, scores, and areas needing improvement.'
    ),
});
export type PersonalizedExerciseSuggestionsInput = z.infer<typeof PersonalizedExerciseSuggestionsInputSchema>;

// Define the output schema for the personalized exercise suggestions flow.
const PersonalizedExerciseSuggestionsOutputSchema = z.object({
  exerciseSuggestions: z
    .array(z.string())
    .describe('A list of personalized exercise suggestions for the student.'),
});
export type PersonalizedExerciseSuggestionsOutput = z.infer<typeof PersonalizedExerciseSuggestionsOutputSchema>;

// Exported function to get personalized exercise suggestions.
export async function personalizedExerciseSuggestions(
  input: PersonalizedExerciseSuggestionsInput
): Promise<PersonalizedExerciseSuggestionsOutput> {
  return personalizedExerciseSuggestionsFlow(input);
}

// Define the prompt for generating personalized exercise suggestions.
const personalizedExerciseSuggestionsPrompt = ai.definePrompt({
  name: 'personalizedExerciseSuggestionsPrompt',
  input: {schema: PersonalizedExerciseSuggestionsInputSchema},
  output: {schema: PersonalizedExerciseSuggestionsOutputSchema},
  prompt: `You are an AI tutor providing personalized exercise suggestions to students.

  Based on the student's learning progress and areas where they need improvement, suggest a list of exercises.
  The student ID is: {{{studentId}}}.
  The course ID is: {{{courseId}}}.
  Here is their learning progress: {{{learningProgress}}}.

  Provide a list of exercise suggestions that will help the student improve their understanding and skills.
  Format the output as a JSON array of strings.`,
});

// Define the Genkit flow for personalized exercise suggestions.
const personalizedExerciseSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedExerciseSuggestionsFlow',
    inputSchema: PersonalizedExerciseSuggestionsInputSchema,
    outputSchema: PersonalizedExerciseSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await personalizedExerciseSuggestionsPrompt(input);
    return output!;
  }
);
