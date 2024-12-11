import OpenAI from "openai";
import fs from 'node:fs';

(async () => {

  const openai = new OpenAI();

  const jobDescription = fs.readFileSync('test-jd-full', 'utf8');
  const systemPrompt = "You're an expert resume writing consulting, you're helping a job applicant improve their chances of getting past resume screening by tailoring their resume for the given job description.";
  const profile = fs.readFileSync('profile', 'utf8');
  const prompt = `Here is the job description:

  ${jobDescription}

  Here is their profile:

  ${profile}

  What are you suggestions to help them get selected?`

  const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          {"role": "system", "content": systemPrompt},
          {"role": "user", "content": prompt}
      ]
  });

  console.log(JSON.stringify(completion, null, 2));

  process.exit(0);
})();

