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

export type WebClipReq = { url?: string; html?: string };

export type WebClipRes = {
  origin: string;
  readable: string;
};

export type WebClipError = { error: "req" | "url" | "markdown" };

async function doAsync(fetcher: () => Promise<any>) {
  try {
    const data = await fetcher();
    return { data };
  } catch (error) {
    return { error };
  }
}

async function convertMarkdown(html: string): Promise<string> {
  if (!html) return "";
  return String(
    await unified()
      .use(rehypeParse)
      .use(rehypeSanitize)
      .use(rehypeRemark)
      .use(remarkGfm)
      .use(remarkStringify, { fences: true })
      .process(html)
  );
}

const attachTitle = (markdown: string, title: string) => {
  if (!title) return markdown;
  return `# ${title}\n${markdown}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WebClipRes | WebClipError>
) {
  const body = req.body as WebClipReq;
  let origin: string;

  if (!body.url && !body.html) {
    return res.status(400).json({ error: "req" });
  }

  if (body.url) {
    const { data: html, error: urlError } = await doAsync(
      async () => await axios.get(body?.url || "")
    );
    if (urlError) {
      return res.status(500).json({ error: "url" });
    }
    const $ = cheerio.load(html.data);
    origin = $("body").html() || "";
  } else {
    origin = body.html || "";
  }

  const doc = new JSDOM(origin);
  const readableDoc = new Readability(doc.window.document).parse();
  const title = readableDoc?.title || "";
  const readable = readableDoc?.content || "";

  const { data: markdown, error: mdError } = await doAsync(
    async () =>
      await Promise.all([convertMarkdown(origin), convertMarkdown(readable)])
  );
  if (mdError) {
    return res.status(500).json({ error: "markdown" });
  }

  res
    .status(200)
    .json({ origin: markdown[0], readable: attachTitle(markdown[1], title) });
  //TODO: sentry에서 에러를 catch 할 수 있도록 에러 처리
}
