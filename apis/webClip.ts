import axios from "axios";
import { Data, Response, Error } from "pages/api/webClip";

export type WebClipData = Data;
export type WebClipRes = Response;

export default async function webClip({ url, html }: WebClipData) {
  const data = { url, html };
  const res = await axios.post<WebClipRes>(`/api/webClip`, data);
  return res.data;
}
