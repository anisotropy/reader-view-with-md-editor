import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeSanitize from "rehype-sanitize";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import * as cheerio from "cheerio";

export type Data = { url?: string; html?: string };

export type Response = {
  origin: string;
  readable: string;
};

async function convertMarkdown(
  html: string,
  fallback?: string
): Promise<string> {
  if (!html) return "";
  try {
    return String(
      await unified()
        .use(rehypeParse)
        .use(rehypeSanitize)
        .use(rehypeRemark)
        .use(remarkGfm)
        .use(remarkStringify, { fences: true })
        .process(html)
    );
  } catch (error) {
    return fallback ? fallback : html;
  }
}

const attachTitle = (markdown: string, title: string) => {
  if (!title) return markdown;
  return `# ${title}\n${markdown}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const body = req.body as Data;
  let origin = "";
  let readable = "";
  let readableText = "";
  let title = "";

  try {
    if (body.url) {
      const html = await axios.get(body.url);
      const $ = cheerio.load(html.data);
      origin = $("body").html() || "";
    } else {
      origin = body.html || "";
    }

    const doc = new JSDOM(origin);
    const readableDoc = new Readability(doc.window.document).parse();
    title = readableDoc?.title || "";
    readable = readableDoc?.content || "";
    readableText = readableDoc?.textContent || "";
  } catch (error) {
    console.log(error);
  }

  [origin, readable] = await Promise.all([
    convertMarkdown(origin),
    convertMarkdown(readable),
  ]);

  res.status(200).json({ origin, readable: attachTitle(readable, title) });
  //TODO: sentry에서 에러를 catch 할 수 있도록 에러 처리
}
