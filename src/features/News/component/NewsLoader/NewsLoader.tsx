'use client';

import React from 'react';
import { useGetNewsData } from '../../hook/useGetNewsData';
import NewsLine from '../NewsLine/NewsLine';
import { newsParamsType } from '@util/types/News/newsType';
import { NewsLoaderStyle } from './NewsLoader.css';
function NewsLoader({ keywords }: { keywords: string }) {
  const { data = [], isLoading, isError, error } = useGetNewsData(keywords);

  if (isLoading) return <div>로딩 중…</div>;
  if (isError) return <div>에러: {error?.message}</div>;

  return (
    <section className={NewsLoaderStyle}>
      {data.map((news) => (
        <NewsLine key={news.link} {...news} />
      ))}
    </section>
  );
}

export default NewsLoader;
