import axios from "axios";
import { Data, Response } from "pages/api/webClip";

export default async function webClip({ url, html }: Data) {
  const data = { url, html };
  const res: { data: Response } = await axios.post(`/api/webClip`, data);
  return res.data;
}
