import { NextRequest, NextResponse } from "next/server";
import { CheerioAPI, load } from 'cheerio';

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ data: await fetchUrlText(body.url) });
}

async function fetchUrlText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    console.log('Got NOK status fetching', response.status, text);
    return "";
  }
  const text = await response.text();
  const $ = load(text);
  $('br').each((i, el) => {
    $(el).replaceWith('\n');
  });
  // Add newline after paragraphs/divs
  $('p, div').each((i, el) => {
    $(el).append('\n');
  });
  const articleText = $('article').text();
  if (articleText.length > 0) {
    console.log('Returning article text', articleText.length, 'for url', url);
    return articleText;
  }
  const mainText = $('main').text();
  if (mainText.length > 0) {
    console.log('Returning main text', mainText.length, 'for url', url);
    return mainText;
  }
  const contentEls = $('.content');
  if (contentEls.length === 1) {
    const contentText = contentEls.text();
    if (contentText.length > 0) {
      console.log('Returning content text', contentText.length, 'for url', url);
      return contentText;  
    }
  }
  $('script, style').remove();

  const bodyText = $('body').text();
  console.log('Returning body text', bodyText.length, 'for url', url)
  return bodyText;
}