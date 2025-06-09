import safeFetch from '../../safeFetch';
import { newsParamsType, NewResType } from '@util/types/News/newsType';
``;

export default async function clientGetNews(word: string, category?: string | null) {
  const { data, error } = await safeFetch<NewResType>('/api/newsRss', 'POST', {
    word,
    category,
  });

  console.log(data);
  return { data, error };
}
