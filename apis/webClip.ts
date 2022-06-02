import axios, { AxiosError } from "axios";
import {
  WebClipReq,
  WebClipRes,
  WebClipError as WcError,
} from "pages/api/webClip";

export type { WebClipReq, WebClipRes };

export default async function webClip({ url, html }: WebClipReq) {
  try {
    const data = { url, html };
    const res = await axios.post<WebClipRes>(`/api/webClip`, data);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      switch (error.response?.data?.error as WcError[keyof WcError]) {
        case "req":
          throw new ReqError();
        case "url":
          throw new UrlError();
        case "markdown":
          throw new MarkdownError();
        default:
          throw new UnknownError();
      }
    }
    throw new UnknownError();
  }
}

export class WebClipError extends Error {
  name = "WebClipError";
}

export class UnknownError extends WebClipError {
  message = "Unknown error occured!";
}

export class ReqError extends WebClipError {
  message = "You must put a webpage URL or HTML codes!";
}

export class UrlError extends WebClipError {
  message = "You put a WRONG URL or We can NOT access the URL!";
}

export class MarkdownError extends WebClipError {
  message = "Can NOT convert HTML to markdown!";
}
