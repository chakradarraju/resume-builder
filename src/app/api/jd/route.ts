import { NextRequest, NextResponse } from "next/server";
import { load } from 'cheerio';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const response = await fetch(body.url);
  if (!response.ok) {
    const text = await response.text();
    console.log('Got NOK status fetching', response.status, text);
    return NextResponse.json({error: 'Unable to fetch URL'}, {status: response.status});
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
  function ret(r: string, from: string = '') {
    return NextResponse.json({
      data: r.replace(/\s*\n+/g, '\n').replace(/[ \t]+/g, ' '),
      from
    });
  }
  $('script, style, iframe').remove();
  const articleText = $('article').text();
  if (articleText.length > 0) {
    console.log('Returning article text', articleText.length, 'for url', body.url);
    return ret(articleText, 'article');
  }
  const mainText = $('main').text();
  if (mainText.length > 0) {
    console.log('Returning main text', mainText.length, 'for url', body.url);
    return ret(mainText, 'main');
  }
  const contentEls = $('.content');
  if (contentEls.length === 1) {
    const contentText = contentEls.text();
    if (contentText.length > 0) {
      console.log('Returning content text', contentText.length, 'for url', body.url);
      return ret(contentText, 'content');  
    }
  }

  const bodyText = $('body').text();
  console.log('Returning body text', bodyText.length, 'for url', body.url)
  return ret(bodyText, 'body');
}