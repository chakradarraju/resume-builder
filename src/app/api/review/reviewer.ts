import Profile from "@/types/profile";
import OpenAI from "openai";

export async function reviewResume(profile: Profile, jobDescription: string): Promise<string> {
  const openai = new OpenAI();

  const systemPrompt = "You're an expert resume writing consulting, you're helping a job applicant improve their chances of getting past resume screening by tailoring their resume for the given job description.";
  const prompt = `${jobDescription.length > 10 ? 'Here is the job description' : '' }:

${jobDescription}

Here is their profile:

${profile}

What are you suggestions to help them get selected?`

  const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          {"role": "system", "content": systemPrompt},
          {"role": "user", "content": prompt}
      ],
      temperature: 0
  });

  console.log('Usage', JSON.stringify(response.usage));

  const content = response.choices[0].message?.content ?? '';

  return content;
}