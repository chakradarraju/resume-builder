import { NextRequest, NextResponse } from "next/server";
import { load } from 'cheerio';

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ data: await fetchUrlText(body.url) });
}

async function fetchUrlText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) return "";
  const text = await response.text();
  const $ = load(text);
  $('script, style').remove();
  $('br').each((i, el) => {
    $(el).replaceWith('\n');
  });
  // Add newline after paragraphs/divs
  $('p, div').each((i, el) => {
    $(el).append('\n');
  });
  return $('body').text();
}