import { NextRequest, NextResponse } from "next/server";
import pdf from 'pdf-parse';
import { parseProfile } from "./parser";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Invalid file." }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const data = await pdf(buffer);
  if (data.numpages > 10) {
    return NextResponse.json({ error: 'Too many pages' }, { status: 400 });
  }
  try {
    const profile = await parseProfile(data.text);
    return NextResponse.json(profile);  
  } catch (e) {
    return NextResponse.json({ error: 'Unable to parse profile' }, { status: 400 });
  }
}