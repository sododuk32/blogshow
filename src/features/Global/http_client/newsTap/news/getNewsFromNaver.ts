import safeFetch from '../../safeFetch';
import { chartData, CurrentDetailData } from '@util/types/charts/TData';
import { newsParamsType } from '@util/types/News/newsType';
import { fetchOgImage } from './fetchOgImage';
import textOver122 from '@util/format/textOver122';
import { NewResType } from '@util/types/News/newsType';
import { formatRelativeDate } from '@util/format/time';
export default async function getNewsFromNaver(keyword: string, categorys?: string | null) {
  const { data, error } = await safeFetch<NewResType>(
    `https://openapi.naver.com/v1/search/news.json?query=${keyword}&display=10&start=2&sort=${categorys || 'sim'}`,
    'GET',
    null,
    {
      'X-Naver-Client-Id': process.env.NaverKey || '',
      'X-Naver-Client-Secret': process.env.NaverSec || '',
      'Cache-Control': 'revalidate: 0',
    }
  );

  const items = data?.items ?? [];
  const itemsWithOg: newsParamsType[] = await Promise.all(
    items.map(async (item) => {
      const ogImage = await fetchOgImage(item.link);
      const description = textOver122(item.description);
      const title = textOver122(item.title);
      const pubdata = formatRelativeDate(item.pubDate);
      return {
        ...item,
        ogImage, // 없으면 undefined
        description: description,
        title: title,
        pubdata: pubdata,
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
