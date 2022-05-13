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

export type WebCilpRes = {
  origin: string;
  readible: string;
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WebCilpRes>
) {
  const url = req.query.url as string;
  let origin = "";
  let readible = "";
  let readibleText = "";
  let title = "";

  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    origin = $("body").html() || "";

    const doc = new JSDOM(html.data);
    const readibleDoc = new Readability(doc.window.document).parse();
    title = readibleDoc?.title || "";
    readible = readibleDoc?.content || "";
    readibleText = readibleDoc?.textContent || "";
  } catch (error) {
    console.log(error);
  }

  [origin, readible] = await Promise.all([
    convertMarkdown(origin),
    convertMarkdown(readible),
  ]);

  res.status(200).json({ origin, readible });
  //TODO: sentry에서 에러를 catch 할 수 있도록 에러 처리
}
