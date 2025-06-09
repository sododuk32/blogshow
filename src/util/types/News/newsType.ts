export type newsParamsType = {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate?: string;
  pubdata?: string;
  ogImage?: string;
};

export type NewResType = {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: newsParamsType[];
};
