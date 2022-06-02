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
      console.error(error);
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
  name = "web clip error";
}

export class UnknownError extends WebClipError {
  message = "unknown";
}

export class ReqError extends WebClipError {
  message = "req";
}

export class UrlError extends WebClipError {
  message = "url";
}

export class MarkdownError extends WebClipError {
  message = "markdown";
}
