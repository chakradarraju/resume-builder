import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { PdfReader } from "pdfreader";
import OpenAI from 'openai';

export interface Part {
  type: "TEXT" | "LIST" | "CHIPS";
  heading?: string;
  text?: string;
  list?: string[];
}

export interface ExperiencePart {
  company?: string;
  timeline?: string;
  role?: string;
  text?: string;
}

export interface Experience {
  experiences: ExperiencePart[];
}

export interface CoursePart {
  school?: string;
  timeline?: string;
  degree?: string;
  text?: string;
}

export interface Education {
  course: CoursePart[];
}

export interface Profile {
  name?: string;
  role?: string;
  picture?: string;
  section1: Part[];
  section2: Part[];
}

async function extractPdfText(pdfPath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);
  return data.text;
}

async function callOpenAIForStructuredData(resumeText: string): Promise<Profile> {
  const openai = new OpenAI();
  
  const prompt = `
Given the following resume text, extract the candidate's profile and format it as a JSON adhering to the following interfaces:

Interfaces:
\`\`\`typescript
export interface Part {
  type: "TEXT" | "LIST" | "CHIPS",
  heading?: string,
  text?: string,
  list?: string[],
}

export interface ExperiencePart {
  company?: string,
  timeline?: string,
  role?: string,
  text?: string,
}

export interface Experience {
  experiences: ExperiencePart[]
}

export interface CoursePart {
  school?: string,
  timeline?: string,
  degree?: string,
  text?: string,
}

export interface Education {
  course: CoursePart[],
}

export interface Profile {
  name?: string,
  role?: string,
  picture?: string,
  section1: Part[],
  section2: Part[],
}
\`\`\`

The "section1" and "section2" parts can be derived from the resume sections, for example "Summary", "Skills", "Experience", "Education" etc. 
Try to map them logically:
- "section1" could be for summary/skills
- "section2" could be for education/experience
If something doesn't fit perfectly, make a reasonable assumption.

Ensure the JSON is strictly following the above interfaces. Include all relevant information.
  
Resume Text:
${resumeText}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        {"role": "system", "content": 'You are a helpful assistant that outputs JSON only, you will not wrap the response in code fences or use any Markdown formatting. Just print the JSON object, the response is going to be directly to JSON.parse()'},
        {"role": "user", "content": prompt}
    ],
    temperature: 0,
  });

  // The API should return JSON that we can parse
  const content = response.choices[0].message?.content?.trim();
  if (!content) {
    throw new Error("No content returned from OpenAI.");
  }
  
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

async function extractPdfTextWithPDFReader(pdfPath: string) {
  const reader = new PdfReader();
  var text = '';
  await new Promise((res, rej) => {
    reader.parseFileItems(pdfPath, (err, item) => {
      if (err) rej(err);
      if (!item) {
        res(true);
      } else if (item.text) {
        text += item.text;
      }
    })  
  });
  return text;
}

async function main() {
  const pdfPath = path.join(__dirname, 'resume.pdf'); // Replace with the actual resume path
  const resumeText = await extractPdfText(pdfPath);
  console.log('Extracted resumeText:' + resumeText);
  //const structuredData = await callOpenAIForStructuredData(resumeText);
  
  //console.log("Structured Profile:\n", JSON.stringify(structuredData, null, 2));
}

main().catch(err => {
  console.error(err);
});
