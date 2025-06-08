import safeFetch from '../../safeFetch';
import { chartData, CurrentDetailData } from '@util/types/charts/TData';
import { newsParamsType } from '../../../../../util/types/News/newsType';
import { fetchOgImage } from './fetchOgImage';

type NewResType = {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: newsParamsType[];
};

export default async function getNewsFromNaver(keyword: string, categorys: string | null) {
  const { data, error } = await safeFetch<NewResType>(
    `https://openapi.naver.com/v1/search/news.json?query=${keyword}&display=10&start=2&sort=${categorys || 'sim'}`,
    'GET',
    null,
    {
      'Cache-Control': 'no-store',
      'X-Naver-Client-Id': process.env.NaverKey || '',
      'X-Naver-Client-Secret': process.env.NaverSec || '',
    }
  );

  const items = data?.items ?? [];
  const itemsWithOg: newsParamsType[] = await Promise.all(
    items.map(async (item) => {

      const ogImage = await fetchOgImage(item.link);
      return {
        ...item,
        ogImage, // 없으면 undefined
      };
    })
  );

  if (error) {
    return { data: [], message: `${error.status}`, status: error.status };
  }

  return {
    data: itemsWithOg,
    message: `good`,
    status: 200,
  };
}
