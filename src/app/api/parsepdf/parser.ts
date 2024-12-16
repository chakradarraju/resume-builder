import Profile from "@/types/profile";
import OpenAI from "openai";

export async function parseProfile(resumeText: string): Promise<Profile> {
  const openai = new OpenAI();

  console.log(`Parsing resume:\n${resumeText}`);
  
  const prompt = `
Given the following resume text, extract the candidate's profile and format it as a JSON adhering to the following interfaces:

Interfaces:
\`\`\`typescript
enum PartType {
  Text = "TEXT",
  List = "LIST",
  Chips = "CHIPS"
}

type SectionItem = (Experience | Education | Part);

interface Part {
  type: PartType,
  heading?: string,
  text?: string,
  list?: string[],
}

interface Experience {
  experiences: ExperiencePart[]
}

interface ExperiencePart {
  company?: string,
  timeline?: string,
  role?: string,
  text?: string,
}

interface Education {
  course: CoursePart[],
}

interface CoursePart {
  school?: string,
  timeline?: string,
  degree?: string,
  text?: string,
}

interface Profile {
  name?: string,
  role?: string,
  section1: SectionItem[],
  section2: SectionItem[],
}
\`\`\`

The "section1" and "section2" parts can be derived from the resume sections, for example "Summary", "Skills", "Experience", "Education" etc. 
Try to map them logically:
- "section1" could be for summary/contacts/skills
- "section2" could be for education/experience/achievements/misc
If something doesn't fit perfectly, make a reasonable assumption.

Ensure the JSON is strictly following the above interfaces. Include all relevant information.
  
Resume Text:
${resumeText}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        {"role": "system", "content": 'You are a helpful assistant that outputs JSON only, you will not wrap the response in code fences or use any Markdown formatting. Just print the JSON object, the response is going to be directly parsed by JSON.parse()'},
        {"role": "user", "content": prompt}
    ],
    temperature: 0,
  });

  console.log('Usage', JSON.stringify(response.usage));

  // The API should return JSON that we can parse
  const content = response.choices[0].message?.content?.trim();
  if (!content) {
    throw new Error("No content returned from OpenAI.");
  }

  console.log(`Parsed profile:\n${content}`);
  
  let profile: Profile;
  
  try {
    profile = JSON.parse(content);
  } catch (err) {
    console.error("Error parsing JSON: ", err);
    console.error("Content received: ", content);
    throw err;
  }
  
  return profile;
}