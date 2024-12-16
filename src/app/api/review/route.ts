import { NextRequest, NextResponse } from "next/server";
import { reviewResume } from "./reviewer";
import Profile from "@/types/profile";

function parseProfile(str: string): Profile | NextResponse {
  try {
    return JSON.parse(str);
  } catch(e) {
    console.error(`Unable to parse ${str}, caught err: ${e}`);
    return NextResponse.json({ error: 'Unable to parse passed profile' }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const profileStr = formData.get("profile") as string;
  const jobDescription = formData.get("jd") as string;
  if (!profileStr) {
    return NextResponse.json({ error: 'Missing profile' }, { status: 400 });
  }
  const profile = parseProfile(profileStr);
  if (profile instanceof NextResponse) {
    return profile;
  }
  try {
    const review = await reviewResume(profile, jobDescription);
    return NextResponse.json({ review });  
  } catch (e) {
    return NextResponse.json({ error: 'Unable to parse profile' }, { status: 400 });
  }
}