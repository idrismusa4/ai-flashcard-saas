import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}`

export async function POST(req) {
  const data = await req.text()

  const completion = await anthropic.completions.create({
    model: "claude-3-sonnet-20240229",
    max_tokens_to_sample: 1000,
    prompt: `${Anthropic.HUMAN_PROMPT} ${systemPrompt}\n\nHere's the text to create flashcards from:\n${data}${Anthropic.AI_PROMPT}`,
    response_format: { type: "json_object" },
  });

  // Parse the JSON response from the Anthropic API
  const flashcards = JSON.parse(completion.completion)

  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards.flashcards)
}